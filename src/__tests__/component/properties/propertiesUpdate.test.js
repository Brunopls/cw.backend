const request = require("supertest");
const app = require("../../../../app");
const Users = require("../../../models/usersModel");
const Properties = require("../../../models/propertiesModel");
const {
  getValidPropertyObject,
  createProperty,
  createUser,
} = require("../../../helpers/integrationTestsHelper");
const { fail } = require("../../../strategies/jwtAuth");

// WHAT is being tested, under what CIRCUMSTANCES and what is the EXPECTED RESULT
describe("agentUpdatePropertyPermissions", () => {
  let user;
  let property;
  let updatedProperty;
  let secondUser;
  /*
   * Creating some other agent's property
   * to test if the current agent can delete it
   */

  beforeAll(async () => {try{
    user = await createUser("agent");
    property = await createProperty(user);
    updatedProperty = await getValidPropertyObject(user);

    secondUser = await createUser("agent");
    secondProperty = await createProperty(secondUser, secondUser);}catch(e){console.log(e)}
  });

  afterAll(async () => {try{
    await Users.deleteExistingUser(user._id);
    await Properties.deleteExistingProperty(property._id);
    await Users.deleteExistingUser(secondUser._id);
    await Properties.deleteExistingProperty(secondProperty._id);}catch(e){console.log(e)}
  });

  test("agentUpdateAnyPropertyFalse", async () => {try{
    let result;

    await request(app.callback())
      .put(`/api/properties/${secondProperty._id}`)
      .set("Authorization", `Bearer ${user.token}`)
      .send(updatedProperty)
      .then((response) => {
        result = response;
      })
      .catch((err) => {
        console.log(err);
      });

    expect(result.statusCode).toEqual(403);}catch(e){
      fail(e);
    }
  });

  test("agentUpdateOwnPropertyTrue", async () => {try{
    let result;

    await request(app.callback())
      .put(`/api/properties/${property._id}`)
      .set("Authorization", `Bearer ${user.token}`)
      .send(updatedProperty)
      .then((response) => {
        result = response;
      })
      .catch((err) => {
        console.log(err);
      });

    expect(result.statusCode).toEqual(204);}catch(e){fail(e);}
  });
});
