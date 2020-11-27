const LocalStrategy = require("passport-local").Strategy;
const { checkCredentials } = require("../helpers/authenticationHelper");

async function authenticate(email, password, done) {
  const user = { email, password };
  const userCredentials = await checkCredentials(user);

  if (userCredentials.authenticated) {
    return done(null, userCredentials.user);
  }
  return done(null, false, { message: userCredentials.message });
}

module.exports = new LocalStrategy(authenticate);
