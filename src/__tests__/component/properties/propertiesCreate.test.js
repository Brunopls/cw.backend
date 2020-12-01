const request = require("supertest");
const app = require("../../../../app");
const Users = require("../../../models/usersModel");
const Properties = require("../../../models/propertiesModel");
const {
    getValidPropertyObject,
    createUser,
} = require("../../../helpers/integrationTestsHelper");


// WHAT is being tested, under what CIRCUMSTANCES and what is the EXPECTED RESULT
describe("agentCreatePropertyPermissions", () => {
  let user;
  let propertyToBeCreated;

  beforeAll(async () => {
    user = await createUser("agent");
    propertyToBeCreated = await getValidPropertyObject(user);
  });

  afterAll(async () => {
    await Users.deleteExistingUser(user._id);
    await Properties.deleteExistingProperty(propertyToBeCreated._id);
  });

  test("agentCreateOwnPropertyTrue", async () => {
    let result; 
    
    await request(app.callback())
      .post(`/api/properties/`)
      .set("Authorization", `Bearer ${user.token}`)
      .send(propertyToBeCreated)
      .then((response) => {
        result = response;
      })
      .catch((err) => {
        console.log(err);
      });

      expect(result.statusCode).toEqual(201);
    });
});