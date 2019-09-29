const express = require("express");
const cors = require("cors");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const keyChain = require("./src/private/key");
const chalk = require("chalk");

let user = {};

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

const app = express();
app.use(cors());
app.use(passport.initialize());

// Facebook Strategy
passport.use(new FacebookStrategy({
  clientID: keyChain.FACEBOOK.clientID,
  clientSecret: keyChain.FACEBOOK.clientSecret,
  callbackUrl: "/auth/facebook/callback"
}, (accessToken, refreshToken, profile, cb) => {
  console.log(chalk.blue(JSON.stringify(profile)));
  user = { ...profile };
  return cb(null, profile);
}));

app.get("/auth/facebook", passport.authenticate("facebook"));
app.get("/auth/facebook/callback", passport.authenticate( "facebook"), ( req, res) => {
  res.redirect("/profile");
})
app.get("/user", (req, res) => {
  console.log("Getting user data!");
  res.send(user);
});
app.get("/auth/logout", (req, res,) => {
  console.log("Logging out!");
  user = {};
  res.redirect("/")
});

const PORT = 5000;
app.listen(PORT);