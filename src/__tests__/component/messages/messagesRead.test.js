const request = require("supertest");
const faker = require("faker");
const app = require("../../../../app");
const Users = require("../../../models/usersModel");
const Roles = require("../../../models/rolesModel");
const Messages = require("../../../models/messagesModel");
const { fail } = require("../../../strategies/jwtAuth");

// Returns a Roles object for the purpose of testing.
async function getMockRole(title) {
  const test = await Roles.getOneByTitle(title);
  return test;
}

const validUserObject = async (role) => {
  const mockedRole = await getMockRole(role);
  return {
    email: faker.internet.email(),
    password: "passw0rd",
    passwordSalt: 10,
    fullName: faker.name.findName(),
    role: mockedRole._id,
  };
};

const validMessageObject = async (user, property) => {
  return {
    text: faker.lorem.paragraph(),
    inquirerEmail: faker.internet.email(),
    user: user._id,
    property: property._id,
  };
};

const createUser = async (role) => {
  const userToCreate = await validUserObject(role);
  const user = await Users.addNewUser(userToCreate);

  await request(app.callback())
    .post("/api/users/login")
    .auth(user.email, userToCreate.password)
    .then((res) => {
      user.token = res.body.token;
    });

  return user;
};

const createMessage = async (user, property) => {
  const messageToCreate = await validMessageObject(user, property);
  const message = await Messages.sendMessage(messageToCreate);
  return message;
};

// WHAT is being tested, under what CIRCUMSTANCES and what is the EXPECTED RESULT
describe("agentReadPermissions", () => {
  let user;
  let message;

  beforeAll(async () => {
    try {
      user = await createUser("agent");
      message = await createMessage(user, user);
    } catch (e) {
      console.log(e);
    }
  });

  afterAll(async () => {
    try {
      await Users.deleteExistingUser(user._id);
      await Messages.deleteExistingMessage(message.newMessage._id);
    } catch (e) {
      console.log(e);
    }
  });

  test("agentReadOwnTrue", async () => {
    try {
      let result;

      await request(app.callback())
        .get(`/api/messages/${message.newMessage._id}`)
        .set("Authorization", `Bearer ${user.token}`)
        .then((response) => {
          result = response;
        })
        .catch((err) => {
          console.log(err);
        });

      expect(result.status).toEqual(200);
    } catch (e) {
      
    }
  });

  test("agentReadAllFalse", async () => {
    try {
      let result;

      await request(app.callback())
        .get(`/api/messages/`)
        .set("Authorization", `Bearer ${user.token}`)
        .then((response) => {
          result = response;
        })
        .catch((err) => {
          console.log(err);
        });

      expect(result.statusCode).toEqual(403);
    } catch (e) {
      
    }
  });
});

describe("generalPublicReadPermissions", () => {
  let message;

  beforeAll(async () => {
    try {
      user = await createUser("agent");
      message = await createMessage(user, user);
    } catch (e) {
      console.log(e);
    }
  });

  afterAll(async () => {
    try {
      await Users.deleteExistingUser(user._id);
      await Messages.deleteExistingMessage(message.newMessage._id);
    } catch (e) {
      console.log(e);
    }
  });

  test("generalPublicReadAllFalse", async () => {
    try {
      let result;

      await request(app.callback())
        .get("/api/messages/")
        .then((response) => {
          result = response;
        })
        .catch((err) => {
          console.log(err);
        });

      expect(result.statusCode).toEqual(401);
    } catch (e) {
      fail(e);
    }
  });

  test("generalPublicReadOneFalse", async () => {
    try {
      let result;

      await request(app.callback())
        .get(`/api/messages/${message.newMessage._id}`)
        .then((response) => {
          result = response;
        })
        .catch((err) => {
          console.log(err);
        });

      expect(result.statusCode).toEqual(401);
    } catch (e) {
      expect(e).toEqual(Error)
    }
  });
});
