const mongoose = require("mongoose");

const { Schema } = mongoose;

/**
 * @class Roles
 * @property {String} title title of the role (i.e. 'admin')
 * @property {String} description description of the role
 */
const RolesSchema = new Schema({
  title: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
  },
});

RolesSchema.statics = {
  /**
   * Get all roles
   * @memberof Roles
   * @async
   * @returns {Promise<Roles[]>} Array of Roles objects
   */
  async getAll() {
    try {
      return this.find({})
        .exec()
        .then((roles) => {
          return roles;
        });
    } catch (err) {
      return Promise.reject(err);
    }
  },

  /**
   * Create new role using request body
   * @memberof Roles
   * @async
   * @param {Object} body request body object
   * @returns {Promise<Role>} new Role object
   */
  async addNewRole(body) {
    const newRole = new this({
      title: body.title,
      description: body.description,
    });
    return newRole.save();
  },
};

module.exports = mongoose.model("Roles", RolesSchema);
