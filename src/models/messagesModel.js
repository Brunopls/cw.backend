const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessagesSchema = new Schema({
  title: {
    type: String,
    required: "title required.",
  }
});

const Messages = mongoose.model('Messages', MessagesSchema);
module.exports = Messages;