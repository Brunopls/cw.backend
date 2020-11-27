const mongoose = require("mongoose");

const { Schema } = mongoose;
/**
 * @class PropertyCategories
 * @property {String} title category title (i.e. 'apartment')
 */
const PropertiesCategoriesSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: "Title is required.",
  },
});

PropertiesCategoriesSchema.statics = {
  /**
   * Create new property using request body
   * @memberof Users
   * @async
   * @param {Object} Property request body object
   * @returns {Promise<Property>} new Property object
   */
  async addNewPropertyCategories(body) {
    const newPropertyCategory = new this({ ...body });
    return newPropertyCategory.save();
  },
  /**
   * Get all users
   * @memberof PropertiesCategories
   * @async
   * @returns {Promise<PropertiesCategories[]>} Array of PropertiesCategories objects
   */
  async getAll() {
    try {
      return this.find({})
        .exec()
        .then((features) => {
          return features;
        });
    } catch (err) {
      return Promise.reject(err);
    }
  },
};

module.exports = mongoose.model(
  "PropertiesCategories",
  PropertiesCategoriesSchema
);
