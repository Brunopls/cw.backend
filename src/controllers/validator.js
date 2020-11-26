/**
 * JSON Schema-based validation on request/response data.
 * @module controllers/validator
 * @author Bruno Correia
 * @see schemas/* JSON Schema definition files
 */

const { Validator, ValidationError } = require("jsonschema");

const usersSchema = require("../schemas/users.json").definitions.user;
const messageSchema = require("../schemas/messages.json").definitions.message;
const propertiesSchema = require("../schemas/properties.json").definitions
  .property;

/**
 * Wrapper - returns a Koa middleware validator for each different schema.
 * @param {object} schema - The JSON schema definition of the resource
 * @param {string} resource - Name of the resource e.g. 'user'
 * @returns {function} - A Koa middleware handler taking (ctx, next) params
 */
const makeKoaValidator = (schema, resource) => {
  const validator = new Validator();
  const validationOptions = {
    throwError: true,
    propertyName: resource,
  };
  /**
   * Middleware handler function
   * @param {object} ctx - Koa context object
   * @param {function} next - Koa next callback
   * @throws {ValidationError} jsonschema library object
   */
  const handler = async (ctx, next) => {
    const { body } = ctx.request;
    try {
      validator.validate(body, schema, validationOptions);
      await next();
    } catch (error) {
      if (error instanceof ValidationError) {
        // console.error(error);
        ctx.status = 400;
        ctx.body = error;
      } else {
        throw error;
      }
    }
  };
  return handler;
};

/** Validates user data against its respective schema */
exports.validateUser = makeKoaValidator(usersSchema, "user");

/** Validates message data against its respective schema */
exports.validateMessage = makeKoaValidator(messageSchema, "message");

/** Validates property data against its respective schema */
exports.validateProperty = makeKoaValidator(propertiesSchema, "property");
