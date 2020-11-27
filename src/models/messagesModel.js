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

MessagesSchema.statics = {
  /**
   * Get all messages related to a certain user or property
   * @memberof Messages
   * @async
   * @returns {Promise<Messages[]>} Array of Messages objects
   */
  async getAll(user, limit = 5, page = 1) {
    try {
        return this.find({user})
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec()
        .then((messages) => {
          return messages;
        });
    } catch (err) {
      return Promise.reject(err);
    }
  },
  /**
   * Get a single message
   * @memberof Messages
   * @async
   * @param {Integer} id Message ID
   * @returns {Messages} Messages objects
   */
  async getByID(id) {
    try {
      return this.findById(id)
        .exec()
        .then((message) => {
          return message;
        });
    } catch (err) {
      return Promise.reject(err);
    }
  },
  /**
   * Send a message to an estate agent
   * @memberof Messages
   * @async
   * @returns {*} Array of Messages objects
   */
  async sendMessage(body) {
    let statusMessage;
    try {
      let newMessage = new this({...body, dateSent: Date.now()});
      newMessage = await newMessage.save();
      statusMessage = "Inquiry sent successfully!"
      return {newMessage, statusMessage}
    } catch (err) {
      statusMessage = "Error sending message."
    }
    return statusMessage;
  },
}

module.exports = mongoose.model("Messages", MessagesSchema);
