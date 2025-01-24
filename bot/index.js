const { App } = require("@slack/bolt");
const axios = require('axios');
require("dotenv").config();
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

app.message("hey", async ({ command, say }) => {
    try {
      say("Hello Human!");
    } catch (error) {
        console.log("err",error);
    }
});