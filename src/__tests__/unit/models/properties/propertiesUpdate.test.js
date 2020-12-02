const Users = require("../../../../models/usersModel");
const Properties = require("../../../../models/propertiesModel");
const {
  createProperty,
  createUser,
  getInvalidPropertyObject,
  getValidPropertyObject,
} = require("../../../../helpers/integrationTestsHelper");
const APIError = require("../../../../helpers/apiErrorHandling");

describe("propertyUpdateUnitTests", () => {
    let user;
    let existingProperty;
    let validPropertyObject;
    let invalidPropertyObject;
  
    beforeAll(async () => {
        user = await createUser("agent");
        existingProperty = await createProperty(user, user);
        validPropertyObject = await getValidPropertyObject(user, user);
        invalidPropertyObject = await getInvalidPropertyObject();
    });
  
    afterAll(async () => {
      await Users.deleteExistingUser(user._id);
      await Properties.deleteExistingProperty(existingProperty._id);
    });

    test("propertyUpdateValidPropertyObjectTrue", async () => {
    let result;

    result = await Properties.updateExistingProperty(
      existingProperty._id,
      validPropertyObject
    );

    expect(result instanceof APIError).toEqual(false);
  });

  test("propertyUpdateInvalidPropertyObjectFalse", async () => {
    let result;

    result = await Properties.updateExistingProperty(
      existingProperty._id,
      invalidPropertyObject
    );
    
    expect(result instanceof APIError).toEqual(true);
  });
})