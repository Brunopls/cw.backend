const mongoose = require("mongoose");
const APIError = require("../helpers/apiErrorHandling");
const { Schema } = mongoose;

/**
 * @class Properties
 * @property {String} title title
 * @property {String} description description
 * @property {Boolean} underOffer true if the property is currently under offer
 * @property {Boolean} highPriority if true, bump property to the top of the list
 * @property {Boolean} visible if false, hide property from general public
 * @property {String} location where the property is located
 * @property {Float} askingPrice asking price
 * @property {ObjectId} propertyCategory category (apartment, house, etc.)
 * @property {ObjectId} propertyFeatures features (has garden, has garage, etc.)
 *
 */
const PropertiesSchema = new Schema({
  title: {
    type: String,
    required: "Title is required.",
  },
  description: {
    type: String,
    required: "Description is required.",
  },
  underOffer: {
    type: Boolean,
    default: false,
  },
  highPriority: {
    type: Boolean,
    default: false,
  },
  visible: {
    type: Boolean,
    default: true,
  },
  location: {
    type: String,
    required: "Location is required.",
  },
  askingPrice: {
    type: Number,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  propertyCategory: {
    type: Schema.Types.ObjectId,
    ref: "PropertiesCategories",
  },
  propertyFeatures: [
    {
      type: Schema.Types.ObjectId,
      ref: "PropertiesFeatures",
    },
  ],
});

PropertiesSchema.statics = {
  /**
   * Get property by ID
   * @memberof Properties
   * @async
   * @param {ObjectId} id Property ID
   * @returns {Promise<Property>} Property object
   */
  async getByID(id) {
    const error = new APIError("Error retrieving record.");
    if (!mongoose.Types.ObjectId.isValid(id)) return error;
    try {
      return this.findById(id)
        .exec()
        .then((property) => {
          return property;
        });
    } catch (err) {
      return error;
    }
  },

  /**
   * Get all properties
   * @memberof Properties
   * @async
   * @returns {Promise<Property[]>} Array of Property objects
   */
  async getAll(limit = 5, page = 1) {
    const error = new APIError("Error retrieving all records.");
    try {
      return this.find({})
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec()
        .then((properties) => {
          return properties;
        });
    } catch (err) {
      return error;
    }
  },
  /**
   * Create new property using request body
   * @memberof Properties
   * @async
   * @param {Object} Property request body object
   * @returns {Property} new Property object
   */
  async addNewProperty(body) {
    const error = new APIError("Error creating property.");
    if (body === undefined || body.title === undefined) return error;
    try {
      const newProperty = new this({ ...body });
      return await newProperty.save();
    } catch {
      return error;
    }
  },
  /**
   * Update an existing property using request body
   * @memberof Properties
   * @async
   * @param {Object} body request body object
   * @param {Integer} id ID of the property to be updated
   * @returns {Object} updated Properties object
   */
  async updateExistingProperty(id, body) {
    const error = new APIError("Error updating record.");
    if (!mongoose.Types.ObjectId.isValid(id)) return error;
    if (
      body === undefined ||
      body.title === undefined ||
      body.description === undefined ||
      body.location === undefined
    )
      return error;
    try {
      return this.findByIdAndUpdate(id, body, { runValidators: true });
    } catch {
      return error;
    }
  },
  /**
   * Delete an existing property
   * @memberof Properties
   * @async
   * @param {Integer} id ID of the property to be removed
   * @returns {Boolean} TODO
   */
  async deleteExistingProperty(id) {
    const error = new APIError("Error deleting record.");
    if (!mongoose.Types.ObjectId.isValid(id)) return error;
    try {
      return this.findByIdAndDelete(id);
    } catch {
      return error;
    }
  },
};

module.exports = mongoose.model("Properties", PropertiesSchema);
