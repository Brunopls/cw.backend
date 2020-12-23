const Users = require("../../../../models/usersModel");
const { createUser } = require("../../../../helpers/integrationTestsHelper");
const APIError = require("../../../../helpers/apiErrorHandling");

describe("usersReadUnitTests", () => {
  let user;

  beforeAll(async () => {
    user = await createUser("agent");
  });

  afterAll(async () => {
    await Users.deleteExistingUser(user._id);
    await Users.db.connection.close();
  });

  test("userReadValidTrue", async () => {
    let result;

    result = await Users.getByID(user._id);

    expect(result instanceof APIError).toEqual(false);
  });

  test("userReadInvalidFalse", async () => {
    let result;

    result = await Users.getByID("user._id");

    expect(result instanceof APIError).toEqual(true);
  });

  test("userReadAllValidUserTrue", async () => {
    let result;

    result = await Users.getAll(user._id);

    expect(result instanceof APIError).toEqual(false);
  });
});
