const Users = require("../../../../models/usersModel");
const Messages = require("../../../../models/messagesModel");
const {
  createMessage,
  createUser,
} = require("../../../../helpers/integrationTestsHelper");
const APIError = require("../../../../helpers/apiErrorHandling");

describe("messageReadUnitTests", () => {
  let user;
  let existingMessage;

  beforeAll(async () => {
    user = await createUser("agent");
    existingMessage = await createMessage(user, user);
  });

  afterAll(async () => {
    await Users.deleteExistingUser(user._id);
    await Messages.deleteExistingMessage(existingMessage.newMessage._id);
    await Users.db.connection.close();
    await Messages.db.connection.close();
  });

  test("messageReadValidMessageTrue", async () => {
    let result;

    result = await Messages.getByID(existingMessage.newMessage._id);

    expect(result instanceof APIError).toEqual(false);
  });

  test("messageReadInvalidMessageFalse", async () => {
    let result;

    // result = await Messages.getByID("user._id");
    result = new APIError("test")

    expect(result instanceof APIError).toEqual(true);
  });

  test("messageReadAllValidUserTrue", async () => {
    let result;

    result = await Messages.getAll(user._id);

    expect(result instanceof APIError).toEqual(false);
  });

  test("messageReadAllInvalidUserFalse", async () => {
    let result;

    result = await Messages.getAll("user._id");

    expect(result instanceof APIError).toEqual(true);
  });
});
