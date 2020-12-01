const request = require("supertest");
const app = require("../../../../app");
const {
  createMessage,
  createUser,
  getValidMessageObject,
} = require("../../../helpers/integrationTestsHelper");
const Users = require("../../../models/usersModel");
const Messages = require("../../../models/messagesModel");

// WHAT is being tested, under what CIRCUMSTANCES and what is the EXPECTED RESULT
describe("agentUpdatePermissions", () => {
  let user;
  let message;
  let updatedMessage;
  let secondUser;
  let secondMessage;

  beforeAll(async () => {
    user = await createUser("agent");
    message = await createMessage(user, user);
    updatedMessage = await getValidMessageObject(user, user);

    secondUser = await createUser("agent");
    secondMessage = await createMessage(secondUser, secondUser);
  });

  afterAll(async () => {
    await Users.deleteExistingUser(user._id);
    await Users.deleteExistingUser(secondUser._id);
    await Messages.deleteExistingMessage(message.newMessage._id);
    await Messages.deleteExistingMessage(secondMessage.newMessage._id);
  });

  test("agentUpdateOwnTrue", async () => {
    let result;

    await request(app.callback())
      .put(`/api/messages/${message.newMessage._id}`)
      .send(updatedMessage)
      .set("Authorization", `Bearer ${user.token}`)
      .then((response) => {
        result = response;
      })
      .catch((err) => {
        console.log(err);
      });

      expect(result.statusCode).toEqual(204);
  });

  test("agentUpdateOtherFalse", async () => {
    let result;

    await request(app.callback())
      .put(`/api/messages/${secondMessage.newMessage._id}`)
      .send(updatedMessage)
      .set("Authorization", `Bearer ${user.token}`)
      .then((response) => {
        result = response;
      })
      .catch((err) => {
        console.log(err);
      });

      expect(result.statusCode).toEqual(403);
  });
});
