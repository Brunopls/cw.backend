const request = require("supertest");
const app = require("../../../../app");
const {
  createMessage,
  createUser,
} = require("../../../helpers/integrationTestsHelper");
const Users = require("../../../models/usersModel");
const Messages = require("../../../models/messagesModel");
const { fail } = require("../../../strategies/jwtAuth");

// WHAT is being tested, under what CIRCUMSTANCES and what is the EXPECTED RESULT
describe("agentDeletePermissions", () => {
  let user;
  let message;
  let secondUser;
  let secondMessage;

  beforeAll(async () => {
    try {
      user = await createUser("agent");
      message = await createMessage(user, user);
      secondUser = await createUser("agent");
      secondMessage = await createMessage(secondUser, secondUser);
    } catch (e) {
      console.log(e);
    }
  });

  afterAll(async () => {
    try {
      await Users.deleteExistingUser(user._id);
      await Messages.deleteExistingMessage(message.newMessage._id);
      await Users.deleteExistingUser(secondUser._id);
      await Messages.deleteExistingMessage(secondMessage.newMessage._id);
    } catch (e) {
      console.log(e);
    }
  });

  test("agentDeleteOwnTrue", async () => {
    try {
      let result;
      await request(app.callback())
        .delete(`/api/messages/${message.newMessage._id}`)
        .set("Authorization", `Bearer ${user.token}`)
        .then((response) => {
          result = response;
        })
        .catch((err) => {
          console.log(err);
        });

      expect(result.statusCode).toEqual(204);
    } catch (e) {
      fail(e);
    }
  });

  test("agentDeleteOtherFalse", async () => {
    try {
      let result;

      await request(app.callback())
        .delete(`/api/messages/${secondMessage.newMessage._id}`)
        .set("Authorization", `Bearer ${user.token}`)
        .then((response) => {
          result = response;
        })
        .catch((err) => {
          console.log(err);
        });

      expect(result.statusCode).toEqual(403);
    } catch (e) {
      fail(e);
    }
  });
});
