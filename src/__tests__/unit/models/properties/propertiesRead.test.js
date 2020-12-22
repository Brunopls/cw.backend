const Users = require("../../../../models/usersModel");
const Properties = require("../../../../models/propertiesModel");
const {
  createProperty,
  createUser,
} = require("../../../../helpers/integrationTestsHelper");
const APIError = require("../../../../helpers/apiErrorHandling");

describe("propertiesReadUnitTests", () => {
  let user;
  let property;

  beforeAll(async () => {
    user = await createUser("agent");
    property = await createProperty(user);
  });

  afterAll(async () => {
    await Users.deleteExistingUser(user._id);
    await Properties.deleteExistingProperty(property._id);
    await Users.db.connection.close();
    await Properties.db.connection.close();
});

  test("propertyReadValidTrue", async () => {
    let result;

    result = await Properties.getByID(property._id);

    expect(result instanceof APIError).toEqual(false);
  });

  test("propertyReadInvalidFalse", async () => {
    let result;

    result = await Properties.getByID("user._id");

    expect(result instanceof APIError).toEqual(true);
  });

  test("propertyReadAllTrue", async () => {
    let result;

    result = await Properties.getAll();

    expect(result instanceof APIError).toEqual(false);
  });
});
