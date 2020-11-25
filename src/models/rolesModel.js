const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RolesSchema = new Schema({
  title: {
    type: String,
    unique: true
  },
  description: {
      type: String
  }
});

const Roles = mongoose.model('Roles', RolesSchema);
module.exports = Roles;