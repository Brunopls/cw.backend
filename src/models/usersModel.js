const mongoose = require("mongoose");

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
};

module.exports = mongoose.model("Users", UsersSchema);
