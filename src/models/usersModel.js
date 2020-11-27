const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
    try {
      return this.find({})
        .exec()
        .then((users) => {
          return users;
        });
    } catch (err) {
      return Promise.reject(err);
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
    try {
      return this.findOne({ email })
        .exec()
        .then((user) => {
          return user;
        });
    } catch (err) {
      return Promise.reject(err);
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
    const newUser = new this({
      ...body,
      password: bcrypt.hashSync(body.password, body.passwordSalt),
    });
    return newUser.save();
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
    try {
      return this.findByIdAndUpdate(id, body);
    } catch (err) {
      return Promise.reject(err);
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
    try {
      return this.findByIdAndRemove(id);
    } catch (err) {
      return Promise.reject(err);
    }
  },
};
module.exports = mongoose.model("Users", UsersSchema);
