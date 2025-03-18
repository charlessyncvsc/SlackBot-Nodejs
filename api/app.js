// a simple backend api for the demonstration.
// routes are under the routes/ folder

const express = require('express');
const cors = require('cors');

app = express();
app.use(express.json());

corsOption = {
  credentials: true,
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE",
  optionsSuccessStatus: 200,
  allowedHeaders: "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Credentials, Access-Control-Allow-Origin",
}
app.use(cors(corsOption));

app.get('/', (req,res) => {
  res.send("Hello World");
});
app.get('/test', (req,res) => {
    res.send("Hello from my test society");
});
app.use('/booking',require("./routes/booking"));



module.exports = app;