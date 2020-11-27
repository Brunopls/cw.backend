/* eslint-disable no-param-reassign, no-underscore-dangle */

const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const Users = require("../models/usersModel");
const info = require("../../config");

/**
 * Compares a text password with the hashed password stored in the database.
 * @param {String} requestPassword simple text password passed in the request
 * @param {String} password hashed password stored in the database
 * @returns {Boolean} true if the passwords match, false if not
 */
async function checkPassword(requestPassword, password) {
  // compare(hashed, text)
  return bcrypt.compare(password, requestPassword);
}

/**
 * Compares user credentials passed in the request with those in the database.
 * Works for both JWT & Basic Auth strategies.
 * @param {Object} userReq user object passed in the request
 * @returns {Object} object
 */
exports.checkCredentials = async (userReq) => {
  let user; let message;
  try {
    // if the request object contains an email, then it is validating a basic auth strategy
    if(userReq.email){
      user = await Users.getByEmail(userReq.email);

      // if the request object contains an ID, then it is validating a JWT strategy
    } else if(userReq._id){
        user = await Users.getByID(userReq._id);
        return {user, authenticated: true, message: `Successfully authenticated user ${userReq.email}`}
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
  const {_id} = user;

  const expiresIn = '1h';

  const payload = {
    sub: _id,
    iat: Date.now()
  };

  const token = jwt.sign(payload, info.config.jwtSecret);

  return {
    token: `${token}`,
    expires: expiresIn
  }
}
