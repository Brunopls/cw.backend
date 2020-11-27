/* eslint-disable no-param-reassign, no-underscore-dangle */

/**
 * JSON Web Token authentication strategy.
 * @module strategies/jwtAuth
 * @author Bruno Correia
 */

const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const passport = require("koa-passport");
const { checkCredentials } = require("../helpers/authenticationHelper");
const info = require("../../config");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = info.config.jwtSecret;

const strategy = new JwtStrategy(opts, async (payload, done) => {
  const userCredentials = await checkCredentials({ _id: payload.sub });
  if (userCredentials.authenticated) {
    passport.serializeUser((_, doneSerialise) => {
      doneSerialise(null, userCredentials.user._id);
    });
    return done(null, userCredentials.user);
  }
  return done(null, false, { message: userCredentials.message });
});

module.exports = strategy;
