const Users = require("../../../../models/usersModel");
const {
  createuser,
  createUser,
} = require("../../../../helpers/integrationTestsHelper");
const APIError = require("../../../../helpers/apiErrorHandling");
const app = require("../../../../../app");

describe("userDeleteUnitTests", () => {
    let user;
    let userToDelete;
  
    beforeAll(async () => {
      user = await createUser("agent");
      userToDelete = await createUser("agent");
    });
  
    afterAll(async () => {
      await Users.deleteExistingUser(user._id);
      if (!userToDelete === undefined) await Users.deleteExistingUser(userToDelete._id);
      await Users.db.connection.close();
    });

    test("userDeleteValidTrue", async () => {
        let result;
    
        result = await Users.deleteExistingUser(userToDelete._id);
    
        expect(result instanceof APIError).toEqual(false);
      });
    
      test("userDeleteInvalidFalse", async () => {
        let result;
    
        result = await Users.deleteExistingUser("user._id");
    
        expect(result instanceof APIError).toEqual(true);
      });
})