const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const Users = require("../models/usersModel");
const { checkCredentials } = require("../helpers/authenticationHelper");
const info = require("../../config");
const passport = require("koa-passport");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = info.config.jwtSecret;

const strategy = new JwtStrategy(opts, async (payload, done) => {
  const userCredentials = await checkCredentials({_id:payload.sub})
    console.log(userCredentials)
  if (userCredentials.authenticated) {
    passport.serializeUser(function(user, done) {
      done(null, userCredentials.user._id);
    });
    return done(null, userCredentials.user);  
  } else {
    return done(null, false, { message: userCredentials.message });
  }
});

module.exports = strategy;

