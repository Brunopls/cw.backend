const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { checkCredentials } = require("../helpers/authenticationHelper");

// exports.localAuth = async function (email, password) {
//   const userReq = { email: email, password: password };
//   passport.use(
//     new LocalStrategy(
//       {
//         email: email,
//         password: password,
//       },
//       authenticate(userReq.email, userReq.password)
//     )
//   );
// };

async function authenticate(email, password, done) {
  console.log("TEST")
  const user = { email: email, password: password };
  const userCredentials = await checkCredentials(user);

  if (userCredentials.authenticated) {
    return done(null, userCredentials.user);
  } else {
    return done(null, false, { message: userCredentials.message });
  }
}

module.exports = new LocalStrategy(authenticate);