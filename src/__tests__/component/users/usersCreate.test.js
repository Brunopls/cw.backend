const request = require("supertest");
const faker = require("faker");
const app = require("../../../../app");
const Users = require("../../../models/usersModel");
const Roles = require("../../../models/rolesModel");

// Returns a Roles object for the purpose of testing.
async function getMockRole() {
  const test = await Roles.getOneByTitle("agent");
  return test;
}

const validUserObject = async () => {
  return {
    email: faker.internet.email(),
    password: "passw0rd",
    passwordSalt: 10,
    fullName: "Test W. Fail",
    role: await getMockRole()._id,
  };
};

// Fails validation - password too short
const invalidUserObject = async () => {
  return {
    email: faker.internet.email(),
    password: "pass",
    passwordSalt: 10,
    fullName: "Test W. Fail",
    role: await getMockRole()._id,
  };
};

describe("generalPublicCreate", () => {
  let newUser;
  beforeAll(async () => {
    try {
      role = await Roles.getOneByTitle("admin");
    } catch (err) {
      console.log(err);
    }
  });

  afterAll(async () => {
    await Users.db.connection.close();
    await Roles.db.connection.close();
    await app.destroy();
  });

  test("generalPublicCreateValidUserTrue", async () => {
    let result;

    /*
     * Since this test will be run, and thus the value be added to the Mongoose document successfully,
     * running this block after each test will ensure that the new data is removed.
     */
    afterEach(async () => {
      await Users.deleteExistingUser(newUser._id);
    });
    // Populates a variable with a valid object
    newUser = await validUserObject();

    await request(app.callback())
      .post("/api/users")
      .send(newUser)
      .then((response) => {
        newUser = response.body.user;
        result = response;
      })
      .catch((err) => {
        console.log(err);
      });

    expect(result.statusCode).toEqual(201);
  });

  test("generalPublicCreateInvalidUserFalse", async () => {
    let result;

    // Populates a variable with an invalid object
    const userToAdd = await invalidUserObject();
    await request(app.callback())
      .post("/api/users")
      .send(userToAdd)
      .then((response) => {
        result = response;
      })
      .catch((err) => {
        console.log(err);
      });

    expect(result.statusCode).toEqual(400);
  });
});
