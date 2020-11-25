const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessagesSchema = new Schema({
  text: {
    type: String,
    required: "Message text is required.",
  },
  inquirerEmail: {
    type: String,
    required: "Email is required."
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  property: {
    type: Schema.Types.ObjectId,
    ref: "Properties"
  },
  archived: {
    type: Boolean,
    default: false
  }
});

const Messages = mongoose.model('Messages', MessagesSchema);
module.exports = Messages;