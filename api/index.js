const app = require('./app');

const PORT = process.env.PORT || 4001;
console.log("Listening on port: ",PORT);
const server = app.listen(PORT);
