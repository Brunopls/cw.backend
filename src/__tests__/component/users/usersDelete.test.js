const request = require("supertest");
const faker = require("faker");
const app = require("../../../../app");
const Users = require("../../../models/usersModel");
const Roles = require("../../../models/rolesModel");

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

const createUser = async (role) => {
  let user;

  const userToCreate = await validUserObject(role);
  user = await Users.addNewUser(userToCreate);

  await request(app.callback())
    .post("/api/users/login")
    .auth(user.email, userToCreate.password)
    .then((res) => {
      user.token = res.body.token;
    });

  return user;
};

describe("adminDeletePermissions", () => {
  let user;
  let userToDelete;
  let token;

  beforeEach(async () => {
    user = await createUser("admin");
    userToDelete = await createUser("agent");

    token = user.token;
  });

  afterEach(async () => {
    await Users.deleteExistingUser(user._id);
  });

  afterAll(async () => {
    await Users.db.connection.close();
    await Roles.db.connection.close();
    await app.destroy();
  });

  test("adminDeleteAnyTrue", async () => {
    let result;

    await request(app.callback())
      .delete(`/api/users/${userToDelete._id}`)
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        result = response;
      })
      .catch((err) => {
        console.log(err);
      });

      expect(result.statusCode).toEqual(204);
    });
});

describe("agentDeletePermissions", () => {
  let user;
  let token;

  beforeEach(async () => {
    const userToCreate = await validUserObject("agent");
    user = await Users.addNewUser(userToCreate);
    return await request(app.callback())
      .post("/api/users/login")
      .auth(user.email, userToCreate.password)
      .then((res) => {
        token = res.body.token;
      });
  });

  afterAll(async () => {
    await Users.db.connection.close();
    await Roles.db.connection.close();
    await app.destroy();
  });

  test("agentDeleteOwnTrue", async () => {
    let result;

    await request(app.callback())
      .delete(`/api/users/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        result = response;
      })
      .catch((err) => {
        console.log(err);
      });

      expect(result.statusCode).toEqual(204);
    });
});

describe("generalPublicDeletePermissions", () => {
  let user;
  beforeAll(async () => {
    try {
      const role = await Roles.getOneByTitle("admin");
      user = await Users.getOneByRole(role._id);
    } catch (err) {
      console.log(err);
    }
  });

  afterAll(async () => {
    await Users.db.connection.close();
    await Roles.db.connection.close();
    await app.destroy();
  });

  test("generalPublicDeleteAnyFalse", async () => {
    let result;

    await request(app.callback())
      .delete(`/api/users/${user._id}`)
      .then((response) => {
        result = response;
      })
      .catch((err) => {
        console.log(err);
      });

      expect(result.statusCode).toEqual(401);
    });
});
