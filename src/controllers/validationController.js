/**
 * JSON Schema-based validation on request/response data.
 * @module controllers/validationController
 * @author Bruno Correia
 * @see schemas/* JSON Schema definition files
 */
const { Validator, ValidationError } = require("jsonschema");

const usersSchema = require("../schemas/users.json").definitions.user;
const usersUpdateSchema = require("../schemas/users.json").definitions.userUpdate;

const messageSchema = require("../schemas/messages.json").definitions.message;
const messageUpdateSchema = require("../schemas/messages.json").definitions.messageUpdate;

const propertiesSchema = require("../schemas/properties.json").definitions
  .property;
const propertiesUpdateSchema = require("../schemas/properties.json").definitions
  .propertyUpdate;

/**
 * Returns a Koa middleware validator for each different schema.
 * @param {Object} schema The JSON schema definition of the resource
 * @param {string} resource Name of the resource e.g. 'user'
 * @returns {function} A Koa middleware handler taking (ctx, next) params
 */
const KoaValidatorFactory = (schema, resource) => {
  const validator = new Validator();
  const validationOptions = {
    throwError: true,
    propertyName: resource,
  };

  /**
   * Middleware handler function
   * @async
   * @param {Object} ctx Koa context object
   * @param {function} next Koa next callback
   * @throws {ValidationError} JSON Schema library object
   */
  const handler = async (ctx, next) => {
    const { body } = ctx.request;
    try {
      validator.validate(body, schema, validationOptions);
      await next();
    } catch (error) {
      if (error instanceof ValidationError) {
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
exports.validateUser = KoaValidatorFactory(usersSchema, "user");
exports.validateUserUpdate = KoaValidatorFactory(usersUpdateSchema, "userUpdate");

/** Validates message data against its respective schema */
exports.validateMessage = KoaValidatorFactory(messageSchema, "message");
exports.validateMessageUpdate = KoaValidatorFactory(messageUpdateSchema, "messageUpdate");

/** Validates property data against its respective schema */
exports.validateProperty = KoaValidatorFactory(propertiesSchema, "property");
exports.validatePropertyUpdate = KoaValidatorFactory(propertiesUpdateSchema, "propertyUpdate");
