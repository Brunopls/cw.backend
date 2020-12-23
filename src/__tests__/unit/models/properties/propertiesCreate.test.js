const Users = require("../../../../models/usersModel");
const Properties = require("../../../../models/propertiesModel");
const {
  createUser,
  getInvalidPropertyObject,
  getValidPropertyObject,
} = require("../../../../helpers/integrationTestsHelper");
const APIError = require("../../../../helpers/apiErrorHandling");

describe("propertiesCreateUnitTests", () => {
  let user;
  let validPropertyObject;
  let invalidPropertyObject;

  beforeAll(async () => {
    user = await createUser("agent");
    validPropertyObject = await getValidPropertyObject(user, user);
    invalidPropertyObject = await getInvalidPropertyObject();
  });

  afterAll(async () => {
    await Users.deleteExistingUser(user._id);
    await Properties.deleteExistingUser(user._id);
    await Users.db.connection.close();
    await Messages.db.connection.close();
  });

  test("propertyCreateValidTrue", async () => {
    let result;

    result = await Properties.addNewProperty(validPropertyObject);

    expect(result instanceof APIError).toEqual(false);
  });

  test("propertyCreateInvalidFalse", async () => {
    let result;

    result = await Properties.addNewProperty(invalidPropertyObject);

    expect(result instanceof APIError).toEqual(true);
  });
});
