/**
 * Authentication module.
 * @module controllers/authenticationController
 * @author Bruno Correia
 */
const passport = require("koa-passport");
const basicAuth = require("../strategies/basicAuth");
const jwtAuth = require("../strategies/jwtAuth");
const localAuth = require("../strategies/localAuth");

passport.use(basicAuth);
// passport.use(jwtAuth);
 passport.use(jwtAuth);

module.exports = passport.authenticate(["jwt", "basic"]);
