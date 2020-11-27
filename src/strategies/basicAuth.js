/**
 * Basic Auth authentication strategy.
 * @module strategies/basicAuth
 * @author Bruno Correia
 */
const { BasicStrategy } = require("passport-http");
const { checkCredentials } = require("../helpers/authenticationHelper");
const passport = require("koa-passport");


async function authenticate(email, password, done) {
  const user = { email: email, password: password };
  const userCredentials = await checkCredentials(user);

  if (userCredentials.authenticated) {
    
    passport.serializeUser(function(user, done) {
      done(null, userCredentials.user._id);
    });

    return done(null, userCredentials.user);  
  } else {
    return done(null, false, { message: userCredentials.message });
  }
}

module.exports = new BasicStrategy(authenticate);