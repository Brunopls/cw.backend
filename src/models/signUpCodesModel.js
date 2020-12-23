const mongoose = require("mongoose");
const APIError = require("../helpers/apiErrorHandling");

const { Schema } = mongoose;

/**
 * @class SignUpCodes
 * @property {String} code the code string
 * @property {Boolean} valid whether or not the code is valid
 */

const SignUpCodesSchema = new Schema({
  code: {
    type: String,
    required: true,
  },
  valid: {
    type: String,
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
});

SignUpCodesSchema.statics = {
  /**
   * Checks if a certain sign-up code exists and is valid
   * @memberof SignUpCodes
   * @async
   * @returns {Boolean} Whether the sign-up code exists or not
   */
  async existsAndIsValid(code) {
    const error = new APIError("Error retrieving retrieving record.");
    return this.findOne({ code: code })
      .exec()
      .then((record) => {
        return record.valid;
      })
      .catch(() => {
        return false;
      });
  },
  /**
   * Create new sign-up code using request body
   * @memberof Users
   * @async
   * @param {String} code request body string
   * @returns {} new Sign-up code object
   */
  async addNewCode(body) {
    const error = new APIError("Error adding record.");
    if (body === undefined || body.code === undefined) return error;
    try {
      const newCode = new this({
        ...body,
      });
      return newCode.save();
    } catch {
      return error;
    }
  },
};

module.exports = mongoose.model(
  "SignUpCodes",
  SignUpCodesSchema,
  "signUpCodes"
);
