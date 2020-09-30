const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
  title: {
    type: String,
    required: "title required.",
  }
});

const Users = mongoose.model('Users', UsersSchema);
module.exports = Users;