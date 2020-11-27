const mongoose = require("mongoose");

const { Schema } = mongoose;

/**
 * @class Messages
 * @property {String} text message text
 * @property {String} inquirerEmail email of the inquirer
 * @property {Date} dateSent date and time at which the message was sent
 * @property {ObjectId} user destinated user
 * @property {ObjectId} property  property the user is inquiring about
 * @property {Boolean} archived if true, archives the message
 */
const MessagesSchema = new Schema({
  text: {
    type: String,
    required: "Message text is required.",
  },
  inquirerEmail: {
    type: String,
    required: "Email is required.",
  },
  dateSent: {
    type: Date,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  property: {
    type: Schema.Types.ObjectId,
    ref: "Properties",
  },
  archived: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Messages", MessagesSchema);
