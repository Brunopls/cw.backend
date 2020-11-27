const mongoose = require("mongoose");

const { Schema } = mongoose;

/**
 * @class PropertyFeatures
 * @property {String} title feature title (i.e. 'garden')
 */
const PropertiesFeaturesSchema = new Schema({
  title: {
    type: String,
    required: "title required.",
  },
});

module.exports = mongoose.model("PropertiesFeatures", PropertiesFeaturesSchema);
