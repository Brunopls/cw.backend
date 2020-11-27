const bcrypt = require("bcrypt");
const Users = require("../models/usersModel");
var jwt = require('jsonwebtoken');
const info = require("../../config");

/**
 * Compares a text password with the hashed password stored in the database.
 * @param {String} requestPassword simple text password passed in the request
 * @param {String} password hashed password stored in the database
 * @returns {Boolean} true if the passwords match, false if not
 */
async function checkPassword(requestPassword, password) {
  //compare(hashed, text)
  return bcrypt.compare(password, requestPassword);
}

/**
 * Compares user credentials passed in the request with those in the database.
 * @param {Object} userReq user object passed in the request
 * @returns {Object} object
 */
exports.checkCredentials = async (userReq) => {
  let user, message;
  try {
    if(userReq.email){
      user = await Users.getByEmail(userReq.email);
    } else {
      if(userReq._id){
        user = await Users.getByID(userReq._id);
        return {user, authenticated: true, message: `Successfully authenticated user ${userReq.email}`}
      }
    }
  } catch (error) {
    return {
      authenticated: false,
      message: `Error during authentication for user ${userReq.email}`,
    };
  }

  if (user) {
    if (await checkPassword(user.password, userReq.password)) {
      return {
        user,
        authenticated: true,
        message: `Successfully authenticated user ${userReq.email}`,
      };
    }
    message = `Password incorrect for user ${userReq.email}`;
  } else {
    message = `No user found with email ${userReq.email}`;
  }
  return { authenticated: false, message };
};

exports.generateJWT = (user) => {
  const _id = user._id;

  expiresIn = '1h';

  payload = {
    sub: _id,
    iat: Date.now()
  };

  const token = jwt.sign(payload, info.config.jwtSecret);

  return {
    token: `Bearer ${token}`,
    expires: expiresIn
  }
}
