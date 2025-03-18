// parse .env file for environment variables
require("dotenv").config();

const { App } = require("@slack/bolt");                 // interacting with slack api
const dialogflow = require('@google-cloud/dialogflow'); // interacting with dialogflow api
const axios = require('axios');                         // interacting with custom api

const bookingCompleteFlags = ['Complete', 'Done'];      // booking complete flags
const tenMinutes = 10*60*1000;

// In memory tables initialized to maintain conversations with dialogflow and booking requests
let liveSessions=new Map();       
let bookings = new Map();                  

// Google Dialogflow configurations
const projectId = 'testchatbot-448915';             // dialogflow project Id
const languageCode = 'en';                          // language setting -- TODO may make this variable

// axios configuration
axios.defaults.baseURL = "http://localhost:4001"
axios.defaults.withCredentials = true

// Initializes slack api with credentials stored in .env file.
const chatApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.APP_TOKEN
});

// start the listening server
(async () => {
  const port = 3000
  await chatApp.start(process.env.PORT || port);
  console.log('Bolt app started!!');
})();


// listen to all messages and filter patterns only within.
chatApp.event("message", async ({ event , say }) => {
  // RegExp matches are inside of context.matches
  console.log(event.text);
  const greetingPattern=/^([Hh]+[Ii]+|[Hh]+[Ee]+[Yy]+|[Hh]+[Ee]+[Ll]+[OoUu]+).*/;
  const bookingPattern =/.*[Bb]+[Oo]+[Kk]+.*/;
  if (bookingPattern.test(event.text)) {
    await processBooking(event,say);
  } else if(greetingPattern.test(event.text)){
    await say(`Hi, how are you? Would you like to make a booking?`);
  } else {
    await processBooking(event, say);
  }
});

// Processing a booking request.
async function processBooking(event, say){
  let sessionObject = getSession(event.user);
    let sessionClient;
    if(sessionObject){
      await say(`...processing your booking, please wait a moment.`);
      sessionClient = sessionObject.session;
    } else {
      await say(`Hi, I am processing your booking, please wait a moment.`);
      sessionClient = new dialogflow.SessionsClient();
    }
    executeQueries(sessionClient,event.user, event.text).then(async (data) => {
      chatContext=data.context;
      await say(data.responseText);
      
      // if the booking is complete then remove the session form the live sesion map otherwise add or update the current mapping.
      // this is implemented to handle simultaneous booking conversations
      // set() is used for update and add.
      if(bookingCompleteFlags.includes(data.responseText) ) {
        console.log("booking information filled");
        addToBookingMap(event.user, 
          {person: extractValueFromIntent(data.intent,'person'), 
            date_time: extractValueFromIntent(data.intent,'date_time')}).then( () => {
              makeBooking(event.user);
              removeFromBookingMap(event.user).then(() => {
                removeFromSessionMap(event.user).then(async () => {
                  console.log("Session complete and in memory maps cleaned");
                  await say('Booking completed');
                })
              })
            })
      } else {
        addToBookingMap(event.user, 
          {person: extractValueFromIntent(data.intent,'person'), 
            date_time: extractValueFromIntent(data.intent,'date_time')}).then( () => {
              addToSessionMap(event.user, {context: data.context, session: data.sessionClient}).then(() => {
                console.log("Session not finished, continue to retrieve parameters from users");
              })
        })
      }
    });
}

// create the query to input into the detectIntent method
// of dialogflow and send it down the pipe.
async function detectIntent(
  query,
  contexts,
  sessionClient,
  sessionId
) {

  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );
  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode,
      },
    },
  };

  if (contexts && contexts.length > 0) {
    request.queryParams = {
      contexts: contexts,
    };
  }

  const responses = await sessionClient.detectIntent(request);
  return responses[0];
}

// extract the query string, execute the detection and handle the return.
async function executeQueries( sessionClient,sessionId, query) {
  // Keeping the context across queries let's us simulate an ongoing conversation with the bot
  let context;
  let intentResponse;
  try {
    console.log(`Sending Query: ${query}`);
    intentResponse = await detectIntent(
      query,
      context,
      sessionClient,
      sessionId
    );
    console.log('Detected intent');
    console.log(
      `Fulfillment Text: ${intentResponse.queryResult.fulfillmentText}`
    );
    // Use the context from this response for next queries
    context = intentResponse.queryResult.outputContexts;
    responseText = intentResponse.queryResult.fulfillmentText;
    return {responseText,context, sessionClient, intent: intentResponse.queryResult };
  } catch (error) {
    console.log(error);
    return {error};
  }
}

// Given the intent returned from dialogflow, return the parameters extracted 
// by dialogflow.

function extractValueFromIntent(intent, name) {
  let structValueFieldName = name;
  if (name == 'person') {
    structValueFieldName = 'name';
  }
  if (intent.parameters.fields[name].structValue == undefined) {
    return null
  } else {
    return intent.parameters.fields[name].structValue.fields[structValueFieldName]['stringValue'];
  }
}

// Utility functions to manage the bookings, add, delete and get.
// note adding with the same key is an update in a map. The booking
// detail needs to be stored in case the user takes more than a few
// minutes to complete the conversation.
async function addToBookingMap(sessionId, obj) {
  try {
    bookings.set(sessionId,{person: (obj.person)? obj.person: null, date_time: (obj.date_time)? obj.date_time: null});
  } catch (error) {
    console.log("addToBookingMap()", error);
  }
}

async function removeFromBookingMap(sessionId) {
  try {
    bookings.delete(sessionId);
  } catch (error) {
    console.log("removeFromBookingMap()", error);
  }
}

function getBooking(sessionId){
  return bookings.get(sessionId);
}


// This calls the api to make a new booking
function makeBooking(sessionId){
  const booking = getBooking(sessionId);
  console.log("makeBooking()", booking);
  axios.post('booking/new',{data: {user:sessionId, booking}});
}


// Utility functions to manage the sessions, add, delete and get.
// note adding with the same key is an update in a map. The session
// need to be stored in case the conversation need to continue for 
// various reason; such as the user not providing enough information
// for a booking
async function addToSessionMap(sessionId, obj) {
  try {
    console.log("addToSessionMap() obj", obj)
    liveSessions.set(sessionId, {timestamp: Date.now(),context: obj.context, session: obj.session});
  } catch (error) {
    console.log("addToSessionMap()", error);
  }
  
}
async function removeFromSessionMap(sessionId) {
  try { 
    liveSessions.delete(sessionId);
    console.log("removeFromSessionMap() liveSessions", liveSessions.size)
  } catch (error) {
    console.log("removeFromSessionMap()", error);
  }
}

function getSession(sessionId) {
  return liveSessions.get(sessionId);
}

// Session clean up will close the session and remove from the
// maintenance mapping table.
async function cleanUpSessions() {
  console.log("Session cleaning up: ");
  const currentTimestamp = Date.now();
  const sessionsCleaned = []
  liveSessions.forEach((liveSession,key) => {
    if(currentTimestamp - liveSession.timestamp > tenMinutes ) {
      console.log("Session cleaned up: ", liveSession.session);
      liveSession.session.close();
      sessionsCleaned.push(key)
    }
  });
  
  for (const key of sessionsCleaned) {
    removeFromSessionMap(key);
  }
}

// Each conversation only last for 10 minutes, otherwise it'd be cleaned up.
setInterval(cleanUpSessions, tenMinutes);
