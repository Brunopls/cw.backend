const Users = require("../../../../models/usersModel");
const {
  createUser,
  getInvalidUserObject,
  getValidUserObject,
} = require("../../../../helpers/integrationTestsHelper");
const APIError = require("../../../../helpers/apiErrorHandling");

describe("userUpdateUnitTests", () => {
    let existingUser;
    let validUserObject;
    let invalidUserObject;
  
    beforeAll(async () => {
      existingUser = await createUser("agent");
      validUserObject = await getValidUserObject("agent");
    invalidUserObject = await getInvalidUserObject();
    });
  
    afterAll(async () => {
      await Users.deleteExistingUser(user._id);
      await Users.deleteExistingUser(existingUser._id);
      await Users.db.connection.close();
    });

    test("userUpdateValidTrue", async () => {
    let result;
    result = await Users.updateExistingUser(
      existingUser._id,
      validUserObject
    );

    expect(result instanceof APIError).toEqual(false);
  });

  test("userUpdateInvalidFalse", async () => {
    let result;

    result = await Users.updateExistingUser(
      existingUser._id,
      invalidUserObject
    );
    
    expect(result instanceof APIError).toEqual(true);
  });
})