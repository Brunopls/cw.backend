const mongoose = require("mongoose");

const { Schema } = mongoose;

const PropertiesFeaturesSchema = new Schema({
  title: {
    type: String,
    required: "title required.",
  },
});

const PropertiesFeatures = mongoose.model(
  "PropertiesFeatures",
  PropertiesFeaturesSchema
);
module.exports = PropertiesFeatures;
