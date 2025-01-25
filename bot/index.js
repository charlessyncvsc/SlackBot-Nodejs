const { App } = require("@slack/bolt");
const axios = require('axios');
require("dotenv").config();

function processBooking(message) {
  // message is the full text input
}
// Initializes your app with credentials
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.APP_TOKEN
});

(async () => {
  const port = 3000
  await app.start(process.env.PORT || port);
  console.log('Bolt app started!!');
})();

app.message(/^(hi|hello|hey).*/, async ({ context, say }) => {
  // RegExp matches are inside of context.matches
  processBooking(context.input)
  const greeting = context.matches[0];
  await say(`${greeting}, how are you? Would you like to make a booking?`);
});

app.message(/.*[Bb]+[Oo]+[Kk]+.*/, async ({ context, say }) => {
  // RegExp matches are inside of context.matches
  console.log(context);
  const greeting = context.matches[0];
  await say(`...processing your booking, please wait a moment.`);
});

