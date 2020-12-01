const request = require("supertest");
const app = require("../../../../app");
const {
  createMessage,
  createUser,
} = require("../../../helpers/integrationTestsHelper");
const Users = require("../../../models/usersModel");
const Messages = require("../../../models/messagesModel");

// WHAT is being tested, under what CIRCUMSTANCES and what is the EXPECTED RESULT
describe("agentDeletePermissions", () => {
  let user;
  let message;
  let secondUser;
  let secondMessage;

  beforeAll(async () => {
    user = await createUser("agent");
    message = await createMessage(user, user);
    secondUser = await createUser("agent");
    secondMessage = await createMessage(secondUser, secondUser);
  });

  afterAll(async () => {
    await Users.deleteExistingUser(user._id);
    await Messages.deleteExistingMessage(message.newMessage._id);
    await Users.deleteExistingUser(secondUser._id);
    await Messages.deleteExistingMessage(secondMessage.newMessage._id);
  });

  test("agentDeleteOwnTrue", async () => {
    return await request(app.callback())
      .delete(`/api/messages/${message.newMessage._id}`)
      .set("Authorization", `Bearer ${user.token}`)
      .then((response) => {
        expect(response.statusCode).toEqual(204);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  test("agentDeleteOtherFalse", async () => {
    return await request(app.callback())
      .delete(`/api/messages/${secondMessage.newMessage._id}`)
      .set("Authorization", `Bearer ${user.token}`)
      .then((response) => {
        expect(response.statusCode).toEqual(403);
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
