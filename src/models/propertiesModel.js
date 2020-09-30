const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PropertiesSchema = new Schema({
  title: {
    type: String,
    required: "title required.",
  }
});

const Properties = mongoose.model('Properties', PropertiesSchema);
module.exports = Properties;