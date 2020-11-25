const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
  email: {
    type: String,
    required: "Email is required.",
    unique: true,
  },
  password: {
    type: String,
    required: "Password is required.",
  },
  passwordSalt: {
    type: String,
  },
  fullName: {
    type: String,
    required: "Full name is required."
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: "Roles",
  },
});

const Users = mongoose.model('Users', UsersSchema);
module.exports = Users;