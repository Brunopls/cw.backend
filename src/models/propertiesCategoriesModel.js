const mongoose = require("mongoose");

const { Schema } = mongoose;
/**
 * @class PropertyCategories
 * @property {String} title category title (i.e. 'apartment')
 */
const PropertiesCategoriesSchema = new Schema({
  title: {
    type: String,
    required: "Title is required.",
  },
});

module.exports = mongoose.model(
  "PropertiesCategories",
  PropertiesCategoriesSchema
);
