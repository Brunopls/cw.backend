const request = require('supertest')
const app = require('../../../../app')
const Users = require("../../../models/usersModel")
const Roles = require("../../../models/rolesModel")
var faker = require('faker');

//Returns a Roles object for the purpose of testing.
async function getMockRole() {
  const test = await Roles.getOneByTitle('agent') 
  return test;
}

const validUserObject = async () => {
  return{ 
  email: faker.internet.email(),
  password: "passw0rd",
  passwordSalt: 10,
  fullName: "Test W. Fail",
  role: await getMockRole()._id}
}

//Fails validation - password too short
const invalidUserObject = async () => {
  return{ 
    email: faker.internet.email(),
    password: "pass",
    passwordSalt: 10,
    fullName: "Test W. Fail",
  role: await getMockRole()._id}
}

describe("generalPublicCreate", () => {
  let newUser;
  beforeAll(async () => {
    try {
      role = await Roles.getOneByTitle('admin');
    } catch(err) {
      console.log(err);
    }
  })

  afterAll(async () => {
    await Users.db.connection.close();
    await Roles.db.connection.close();
    await app.destroy();
  })

  test("generalPublicCreateValidUserTrue", async () => {
    /*
    * Since this test will be run, and thus the value be added to the Mongoose document successfully,
    * running this block after each test will ensure that the new data is removed. 
    */
    afterEach(async () => {
      await Users.deleteExistingUser(newUser._id);
    })

    //Populates a variable with a valid object
    newUser = await validUserObject();
    return await request(app.callback())
      .post('/api/users')
      .send(newUser)
      .then((response) => {
        newUser = response.body.user;
        expect(response.statusCode).toEqual(201)
      })
      .catch((err) => {
        console.log(err)
      })
  });

  test("generalPublicCreateInvalidUserFalse", async () => {
    //Populates a variable with an invalid object
    const userToAdd = await invalidUserObject();
    return await request(app.callback())
      .post('/api/users')
      .send(userToAdd)
      .then((response) => {
        expect(response.statusCode).toEqual(400)
      })
      .catch((err) => {
        console.log(err)
      })
  });
})