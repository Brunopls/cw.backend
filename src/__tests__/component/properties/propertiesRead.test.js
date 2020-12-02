const request = require("supertest");
const app = require("../../../../app");
const Users = require("../../../models/usersModel");
const Properties = require("../../../models/propertiesModel");
const {
  createProperty,
  createUser,
} = require("../../../helpers/integrationTestsHelper");

// WHAT is being tested, under what CIRCUMSTANCES and what is the EXPECTED RESULT
describe("generalPublicReadPermissions", () => {
  let user;
  let property;

  beforeAll(async () => {
    user = await createUser("agent");
    property = await createProperty(user);
  });

  afterAll(async () => {
    await Users.deleteExistingUser(user._id);
    await Properties.deleteExistingProperty(property._id);
  });

  test("generalPublicReadAnyTrue", async () => {
    let result;

    await request(app.callback())
      .get(`/api/properties/`)
      .then((response) => {
        result = response;
      })
      .catch((err) => {
        console.log(err);
      });

    expect(result.statusCode).toEqual(200);
  });

  test("generalPublicReadOneTrue", async () => {
    let result;

    await request(app.callback())
      .get(`/api/properties/${property._id}`)
      .then((response) => {
        result = response;
      })
      .catch((err) => {
        console.log(err);
      });

    expect(result.statusCode).toEqual(200);
  });
});
