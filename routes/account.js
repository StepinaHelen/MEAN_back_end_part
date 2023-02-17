const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config/db");
const Post = require("../models/post");

router.post("/reg", (req, res) => {
  const { name, email, password, login } = req.body;
  let newUser = new User({
    name,
    email,
    password,
    login,
  });

  User.addUser(newUser, (err, user) => {
    if (err) {
      res.json({ success: false, msg: "User has not added." });
    } else {
      res.json({ success: true, msg: "User has been added." });
    }
  });
});

router.post("/auth", (req, res) => {
  const login = req.body.login;
  const password = req.body.password;
  User.getUserByLogin(login, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({ success: false, msg: "This  user was not found" });
    }
    User.comparePass(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign(user.toJSON(), config.secret, {
          expiresIn: 3600 * 24,
        });
        res.json({
          success: true,
          token: "JWT" + token,
          user: {
            id: user._id,
            name: user.name,
            login: user.login,
            email: user.email,
          },
        });
      } else {
        return res.json({ success: false, msg: "Password mismatch" });
      }
    });
  });
});

// router.get(
//   "/dashboard",
//   passport.authenticate("jwt", { session: false }), //forbid access to the page
//   (req, res) => {
//     res.send("Dashboard!");
//   }
// );

router.post("/dashboard", (req, res) => {
  const { title, category, photo, text, author, date } = req.body;
  let newPost = new Post({
    title,
    category,
    photo,
    text,
    author,
    date,
  });

  addPost.addPost(newPost, (err, post) => {
    if (err) {
      res.json({ success: false, msg: "Post has not added." });
    } else {
      res.json({ success: true, msg: "Post has been added." });
    }
  });
});

module.exports = router;
