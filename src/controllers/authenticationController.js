/**
 * Authentication module.
 * @module controllers/authenticationController
 * @author Bruno Correia
 */
const passport = require("koa-passport");
const basicAuth = require("../strategies/basicAuth");
const jwtAuth = require("../strategies/jwtAuth");

passport.use(basicAuth);
// passport.use(jwtAuth);

module.exports = passport.authenticate(["basic", "jwt"], { session: false });
