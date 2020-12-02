const Users = require("../../../../models/usersModel");
const {
  createUser,
  getInvalidUserObject,
  getValidUserObject,
} = require("../../../../helpers/integrationTestsHelper");
const APIError = require("../../../../helpers/apiErrorHandling");

describe("UsersCreateUnitTests", () => {
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
    });

    test("UserCreateValidTrue", async () => {
        let result;
    
        result = await Users.addNewUser(validUserObject);
    
        expect(result instanceof APIError).toEqual(false);
      });
    
      test("UserCreateInvalidFalse", async () => {
        let result;
    
        result = await Users.addNewUser(invalidUserObject);
    
        expect(result instanceof APIError).toEqual(true);
      });
})

