const Users = require("../../../../models/usersModel");
const Properties = require("../../../../models/propertiesModel");
const {
  createProperty,
  createUser,
} = require("../../../../helpers/integrationTestsHelper");
const APIError = require("../../../../helpers/apiErrorHandling");

describe("propertyDeleteUnitTests", () => {
    let user;
    let propertyToDelete;
  
    beforeAll(async () => {
      user = await createUser("agent");
      propertyToDelete = await createProperty(user);
    });
  
    afterAll(async () => {
      await Users.deleteExistingUser(user._id);
      await Users.db.connection.close();
      await Properties.db.connection.close();
    });

    test("propertyDeleteValidTrue", async () => {
        let result;
    
        result = await Properties.deleteExistingProperty(propertyToDelete._id);
    
        expect(result instanceof APIError).toEqual(false);
      });
    
      test("propertyDeleteInvalidFalse", async () => {
        let result;
    
        result = await Properties.deleteExistingProperty("user._id");
    
        expect(result instanceof APIError).toEqual(true);
      });
})