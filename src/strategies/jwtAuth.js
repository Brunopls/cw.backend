const {JwtStrategy, ExtractJwt} = require('passport-jwt');
const Users = require("../models/usersModel");

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';
opts.issuer = 'accounts.examplesoft.com';
opts.audience = 'yoursite.net';

// passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
//     User.findOne({id: jwt_payload.sub}, function(err, user) {
//         if (err) {
//             return done(err, false);
//         }
//         if (user) {
//             return done(null, user);
//         } else {
//             return done(null, false);
//             // or you could create a new account
//         }
//     });
// }));

async function checkPassword(requestPassword, password) {
    return bcrypt.compare(password, requestPassword);
}

async function checkCredentials(payload, done) {
    let user;
    let message;
    try {
      user = await Users.getByEmail(payload.sub.email);
    } catch (error) {
      return done(error, {message: `Error during authentication for user ${email}`});
    }
    if (user) {
      if (await checkPassword(user.password, password)) {
        return done(null, user, {message: `Successfully authenticated user ${email}`});
      }
      message = `Password incorrect for user ${email}`
    } else {
      message = `No user found with email ${email}`
    }
    return done(null, false, message);
  }

