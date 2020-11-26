const mongoose = require("mongoose");

const { Schema } = mongoose;

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
    type: Schema.Types.Decimal128,
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

const Properties = mongoose.model("Properties", PropertiesSchema);
module.exports = Properties;
