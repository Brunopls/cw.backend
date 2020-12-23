const Users = require("../../../../models/usersModel");
const Messages = require("../../../../models/messagesModel");
const {
  createMessage,
  createUser,
  getInvalidMessageObject,
  getValidMessageObject,
} = require("../../../../helpers/integrationTestsHelper");
const APIError = require("../../../../helpers/apiErrorHandling");

describe("messageUpdateUnitTests", () => {
  let user;
  let existingMessage;
  let validMessageObject;
  let invalidMessageObject;

  beforeAll(async () => {
    user = await createUser("agent");
    existingMessage = await createMessage(user, user);
    validMessageObject = await getValidMessageObject(user, user);
    invalidMessageObject = await getInvalidMessageObject();
  });

  afterAll(async () => {
    await Users.deleteExistingUser(user._id);
    await Messages.deleteExistingMessage(existingMessage.newMessage._id);
    await Users.db.connection.close();
    await Messages.db.connection.close();
  });

  test("messageUpdateValidMessageObjectTrue", async () => {
    let result;

    result = await Messages.updateExistingMessage(
      existingMessage.newMessage._id,
      validMessageObject
    );

    expect(result instanceof APIError).toEqual(false);
  });

  test("messageUpdateInvalidMessageObjectFalse", async () => {
    let result;

    result = await Messages.updateExistingMessage(
      existingMessage.newMessage._id,
      invalidMessageObject
    );

    expect(result instanceof APIError).toEqual(true);
  });
});
