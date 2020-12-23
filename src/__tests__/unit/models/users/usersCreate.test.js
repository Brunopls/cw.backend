const Users = require("../../../../models/usersModel");
const {
  createUser,
  getInvalidUserObject,
  getValidUserObject,
} = require("../../../../helpers/integrationTestsHelper");
const APIError = require("../../../../helpers/apiErrorHandling");

describe("usersCreateUnitTests", () => {
  let user;
  let validUserObject;
  let invalidUserObject;

  beforeAll(async () => {
    user = await createUser("agent");
    validUserObject = await getValidUserObject("agent");
    invalidUserObject = await getInvalidUserObject();
  });

  afterAll(async () => {
    await Users.deleteExistingUser(user._id);
    await Users.db.connection.close();
  });

  test("userCreateValidTrue", async () => {
    let result;

    result = await Users.addNewUser(validUserObject);
    if (!result instanceof APIError) await Users.deleteExistingUser(result._id);

    expect(result instanceof APIError).toEqual(false);
  });

  test("userCreateInvalidFalse", async () => {
    let result;

    result = await Users.addNewUser(invalidUserObject);

    expect(result instanceof APIError).toEqual(true);
  });
});
