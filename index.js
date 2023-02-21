const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");
const config = require("./config/db");
const account = require("./routes/account");
const session = require("express-session");
const Post = require("./models/post");
require("dotenv").config();

const app = express();

const port = process.env.PORT;
app.use(session({ secret: config.secret }));

app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport); //call the function

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" })); //get data from queries
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimi: 1000000,
  })
);

mongoose.connect(config.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//connect to database
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
  Post.find().then(
    //get all post from db
    (posts) => res.json(posts)
  );
});

app.get("/post/:id", (req, res) => {
  const id = req.url.split("/")[2];
  Post.findById(id).then((post) => res.json(post));
});

app.patch("/post/:id", (req, res) => {
  const id = req.params.id;
  Post.findByIdAndUpdate({ _id: id }, req.body).then((post) => res.json(post));
});

app.delete(
  "/post/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const id = req.url.split("/")[2];
    Post.deleteOne({ _id: id }).then(() => res.json({ success: true }));
  }
);

app.use("/account", account); //add routing
