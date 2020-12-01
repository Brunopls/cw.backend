/* eslint-disable no-param-reassign, no-underscore-dangle */

/**
 * Basic Auth authentication strategy.
 * @module strategies/basicAuth
 * @author Bruno Correia
 */
const { BasicStrategy } = require("passport-http");
const passport = require("koa-passport");
const { checkCredentials } = require("../helpers/authenticationHelper");

async function authenticate(email, password, done) {
  const user = { email, password };
  const userCredentials = await checkCredentials(user);
  if (userCredentials.authenticated) {
    passport.serializeUser((_, doneSerialise) => {
      doneSerialise(null, userCredentials.user._id);
    });

    return done(null, userCredentials.user);
  }
  return done(null, false, { message: userCredentials.message });
}

module.exports = new BasicStrategy(authenticate);
