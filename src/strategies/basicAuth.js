/**
 * Basic Auth authentication strategy.
 * @module strategies/basicAuth
 * @author Bruno Correia
 */
const { BasicStrategy } = require("passport-http");
const { checkCredentials } = require("../helpers/authenticationHelper");

// /**
//  * Compares a text password with the hashed password stored in the database.
//  * @param {String} requestPassword simple text password passed in the request
//  * @param {String} password hashed password stored in the database
//  * @returns {Boolean} true if the passwords match, false if not
//  */
// async function checkPassword(requestPassword, password) {
//   return bcrypt.compare(password, requestPassword);
// }

// /**
//  * Compares user credentials passed in the request with those in the database.
//  * @param {String} email email passed in the request
//  * @param {String} password simple text password passed in the request
//  * @param {Function} done callback function
//  * @returns {*}
//  */
// async function checkCredentials(email, password, done) {
//   let user;
//   try {
//     user = await Users.getByEmail(email);
//   } catch (error) {
//     console.error(`Error during authentication for user ${email}`);
//     return done(error);
//   }

//   if (user) {
//     if (await checkPassword(user.password, password)) {
//       console.log(`Successfully authenticated user ${email}`);
//       return done(null, user);
//     }
//     console.log(`Password incorrect for user ${email}`);
//   } else {
//     console.log(`No user found with email ${email}`);
//   }
//   return done(null, false);
// }

// async function checkPassword(requestPassword, password) {
//   return bcrypt.compare(password, requestPassword);
// }

// async function checkCredentials(email, password, done) {
//   let user;
//   let message;
//   try {
//     user = await Users.getByEmail(email);
//   } catch (error) {
//     return done(error, {message: `Error during authentication for user ${email}`});
//   }
//   if (user) {
//     if (await checkPassword(user.password, password)) {
//       return done(null, user, {message: `Successfully authenticated user ${email}`});
//     }
//     message = `Password incorrect for user ${email}`
//   } else {
//     message = `No user found with email ${email}`
//   }
//   return done(null, false, message);
// }

async function authenticate(email, password, done) {
  const user = {email: email, password: password};
  const userCredentials = await checkCredentials(user);

  if(userCredentials.authenticated)
  {
    return done(null, userCredentials.user)
  } else {
    return done(null, false, {message:userCredentials.message})
  }
}

module.exports = new BasicStrategy(authenticate);
