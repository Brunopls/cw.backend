const mongoose = require("mongoose");

const { Schema } = mongoose;

const PropertiesCategoriesSchema = new Schema({
  title: {
    type: String,
    required: "Title is required.",
  },
});

const PropertiesCategories = mongoose.model(
  "PropertiesCategories",
  PropertiesCategoriesSchema
);
module.exports = PropertiesCategories;
