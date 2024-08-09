//load environment variables from .env to process.env
require("dotenv").config();

let express = require("express");
let app = express();
console.log("Hello World");

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  //next() allows the server to continue to the next function in the call stack
  next();
});

//Handles all get requests
app.get("/", (req, res) => {
  let absolutePath = __dirname + "/views/index.html";
  res.sendFile(absolutePath);
});

// Middleware = functions that intercept route handlers adding some kind of information
// middleware func = express.static(path)
app.use("/public", express.static(__dirname + "/public"));

app.get("/json", (req, res) => {
  process.env.MESSAGE_STYLE == "uppercase"
    ? res.json({ message: "HELLO JSON" })
    : res.json({ message: "Hello json" });
});

// Chaining middleware to create a time server
app.get(
  "/now",
  (req, res, next) => {
    //This is the middleware function
    req.time = new Date().toString();
    next();
  },
  (req, res) => {
    //This is the final handler
    res.send({ time: req.time });
  }
);

module.exports = app;
