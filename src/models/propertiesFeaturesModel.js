const mongoose = require("mongoose");

const { Schema } = mongoose;

/**
 * @class PropertyFeatures
 * @property {String} title feature title (i.e. 'garden')
 */
const PropertiesFeaturesSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: "title required.",
  },
});

PropertiesFeaturesSchema.statics = {
  /**
   * Create new property using request body
   * @memberof PropertiesFeatures
   * @async
   * @param {Object} PropertyFeatures request body object
   * @returns {Promise<PropertiesFeatures>} new Property object
   */
  async addNewPropertyFeature(body) {
    const newPropertyFeature = new this({ ...body });
    return newPropertyFeature.save();
  },
  /**
   * Get all users
   * @memberof PropertiesFeatures
   * @async
   * @returns {Promise<PropertiesFeatures[]>} Array of PropertiesFeatures objects
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

module.exports = mongoose.model("PropertiesFeatures", PropertiesFeaturesSchema);
