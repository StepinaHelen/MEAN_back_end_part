const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");
const config = require("./config/db");
const account = require("./routes/account");
const session = require("express-session");

const app = express();

const port = 3000;
app.use(session({ secret: config.secret }));

app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport); //call the function

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" })); //get data from queries

mongoose.connect(config.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); //connect to database
mongoose.connection.on("connected", () => {
  console.log("Successfull connection to the database!)");
});

mongoose.connection.on("error", (err) => {
  console.log("Not successfull connection to the database" + err);
});

app.listen(port, () => {
  console.log("The was running on the port: " + port);
});

app.get("/", (req, res) => {
  res.send("Home Page!");
});

app.use("/account", account);
