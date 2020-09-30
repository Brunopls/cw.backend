const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PropertiesCategoriesSchema = new Schema({
  title: {
    type: String,
    required: "title required.",
  }
});

const PropertiesCategories = mongoose.model('PropertiesCategories', PropertiesCategoriesSchema);
module.exports = PropertiesCategories;