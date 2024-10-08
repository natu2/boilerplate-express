//load environment variables from .env to process.env
require("dotenv").config();
//require body-parses to pare req body data (for POST requests)
const bodyParser = require("body-parser");

let express = require("express");
let app = express();
console.log("Hello World");

// middleware logger, request body parser
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  //next() allows the server to continue to the next function in the call stack
  next();
}, bodyParser.urlencoded({ extended: false }));

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

//Get route parameter input from the client
app.get("/:word/echo", (req, res, next) => {
  let word = req.params.word;
  res.send({ echo: word });
});

//Get query parameter input from the client
// The below format allows for chaining different API methods for the same route
// The get request should pull input from query params in the URL
// the post request should use the input from HTML form which will put variables into request body thanks to bodyParser middleware
app
  .route("/name")
  .get((req, res) => {
    let firstname = req.query.first;
    let lastname = req.query.last;
    res.send({ name: `${firstname} ${lastname}` });
  })
  .post((req, res) => {
    let firstname = req.body.first;
    let lastname = req.body.last;
    res.send({ name: `${firstname} ${lastname}` });
  });

module.exports = app;
