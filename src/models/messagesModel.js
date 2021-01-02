const mongoose = require("mongoose");
const status = require("http-status");
const APIError = require("../helpers/apiErrorHandling");

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
    required: true,
  },
  inquirerEmail: {
    type: String,
    required: true,
  },
  dateSent: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  property: {
    type: Schema.Types.ObjectId,
    ref: "Properties",
    required: true,
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
  async getAll(user, limit = 5, page = 1, showArchived = false) {
    const error = new APIError("Error retrieving all records.");
    if (!mongoose.Types.ObjectId.isValid(user._id)) return error;
    const options = {};
    
    options.user = user._id;
    
    if(!showArchived){
      options.archived = "false"
    }

    try {
      return this.find(options)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({dateSent: -1})
        .populate('property')
        .exec()
        .then((messages) => {
          return messages;
        });
    } catch {
      return error;
    }
  },
  /**
   * Get number of messages
   * @memberof Messages
   * @async
   * @returns {Integer} number of messages
   */
  async getCount(user, showArchived = false) {
    const error = new APIError("Error retrieving all records.");
    const options = {};
    options.user = user._id;
    
    if(!showArchived){
      options.archived = "false"
    }

    try {
      return this.countDocuments(options)
        .exec()
    } catch (err) {
      return error;
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
    const error = new APIError("Error retrieving record.");
    if (!mongoose.Types.ObjectId.isValid(id)) return error;

    try {
      return this.findById(id)
        .exec()
        .then((message) => {
          return message;
        });
    } catch {
      return error;
    }
  },

  /**
   * Send a message to an estate agent
   * @memberof Messages
   * @async
   * @returns {*} Array of Messages objects
   */
  async sendMessage(body) {
    const error = new APIError("Error sending message.");
    let statusMessage;
    try {
      let newMessage = new this({ ...body, dateSent: Date.now() });
      newMessage = await newMessage.save();
      statusMessage = "Inquiry sent successfully!";
      return { newMessage, statusMessage };
    } catch {
      return error;
    }
  },
  /**
   * Deletes a message from the database
   * @memberof Messages
   * @async
   * @returns {*} A status message
   */
  async deleteExistingMessage(id) {
    const error = new APIError("Error deleting record.");
    if (!mongoose.Types.ObjectId.isValid(id)) return error;
    try {
      return await this.findByIdAndDelete(id);
    } catch {
      return error;
    }
  },

  /**
   * Deletes a message from the database
   * @memberof Messages
   * @async
   * @returns {*} Error or Message object
   */
  async updateExistingMessage(id, body) {
    const error = new APIError("Error updating record.");
    if (!mongoose.Types.ObjectId.isValid(id)) return error;
    if (
      body === undefined ||
      body.text === undefined ||
      body.inquirerEmail === undefined
    )
      return error;
    try {
      return await this.findByIdAndUpdate(id, body);
    } catch {
      return error;
    }
  },
};

module.exports = mongoose.model("Messages", MessagesSchema);
