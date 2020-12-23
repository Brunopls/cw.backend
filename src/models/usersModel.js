const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const APIError = require("../helpers/apiErrorHandling");
const { Schema } = mongoose;

/**
 * @class Users
 * @property {String} email unique email, used for logging in
 * @property {String} password hashed password
 * @property {String} passwordSalt password salt used for hashing
 * @property {String} fullName full name
 * @property {ObjectId} role role
 *
 */
const UsersSchema = new Schema({
  email: {
    type: String,
    required: "Email is required.",
    unique: true,
  },
  password: {
    type: String,
    required: "Password is required.",
  },
  passwordSalt: {
    type: String,
  },
  fullName: {
    type: String,
    required: "Full name is required.",
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: "Roles",
  },
});

UsersSchema.statics = {
  /**
   * Get user by ID
   * @memberof Users
   * @async
   * @param {ObjectId} id User ID
   * @returns {Promise<User>} User object
   */
  async getByID(id) {
    const error = new APIError("Error retrieving record.");
    if (!mongoose.Types.ObjectId.isValid(id)) return error;
    try {
      return this.findById(id)
        .exec()
        .then((user) => {
          return user;
        });
    } catch (err) {
      return Promise.reject(err);
    }
  },

  /**
   * Get all users
   * @memberof Users
   * @async
   * @returns {Promise<User[]>} Array of User objects
   */
  async getAll() {
    const error = new APIError("Error retrieving record.");
    try {
      return this.find({})
        .lean()
        .exec()
        .then((users) => {
          return users;
        });
    } catch {
      return error;
    }
  },

  /**
   * Get one by role
   * @memberof Users
   * @async
   * @returns {Promise<User>} User object
   */
  async getOneByRole(role) {
    const error = new APIError("Error retrieving record.");
    if (role === undefined) return error;
    try {
      return this.findOne({ role })
        .lean()
        .exec()
        .then((user) => {
          return user;
        });
    } catch {
      return error;
    }
  },

  /**
   * Get user by email
   * @memberof Users
   * @async
   * @param {String} email user email
   * @returns {Promise<User>} User object
   */
  async getByEmail(email) {
    const error = new APIError("Error retrieving record.");
    if (email === undefined) return error;
    try {
      return this.findOne({ email })
        .exec()
        .then((user) => {
          return user;
        });
    } catch {
      return error;
    }
  },

  /**
   * Create new user using request body
   * @memberof Users
   * @async
   * @param {Object} User request body object
   * @returns {Promise<User>} new User object
   */
  async addNewUser(body) {
    const error = new APIError("Error adding record.");
    if (body === undefined || body.email === undefined) return error;
    try {
      const newUser = new this({
        ...body,
        passwordSalt: 10,
        password: bcrypt.hashSync(body.password, body.passwordSalt),
      });
      return newUser.save();
    } catch {
      return error;
    }
  },
  /**
   * Update an existing user using request body
   * @memberof Users
   * @async
   * @param {Object} body request body object
   * @param {Integer} id ID of the user to be updated
   * @returns {Promise<User>} updated User object
   */
  async updateExistingUser(id, body) {
    const error = new APIError("Error updating record.");
    if (id === undefined || body === undefined || body.email === undefined)
      return error;
    try {
      return this.findByIdAndUpdate(id, body, { runValidators: true });
    } catch {
      return error;
    }
  },

  /**
   * Delete an existing user
   * @memberof Users
   * @async
   * @param {Integer} id ID of the user to be removed
   * @returns {Promise<User>} TODO
   */
  async deleteExistingUser(id) {
    const error = new APIError("Error updating record.");
    if (!mongoose.Types.ObjectId.isValid(id)) return error;
    try {
      return this.findByIdAndDelete(id);
    } catch {
      return error;
    }
  },
};

module.exports = mongoose.model("Users", UsersSchema);
