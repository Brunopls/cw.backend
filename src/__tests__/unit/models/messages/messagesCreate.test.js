const Users = require("../../../../models/usersModel");
const Messages = require("../../../../models/messagesModel");
const {
  createUser,
  getInvalidMessageObject,
  getValidMessageObject,
} = require("../../../../helpers/integrationTestsHelper");
const APIError = require("../../../../helpers/apiErrorHandling");

describe("messageCreateUnitTests", () => {
    let user;
    let validMessageObject;
    let invalidMessageObject;
  
    beforeAll(async () => {
      user = await createUser("agent");
      validMessageObject = await getValidMessageObject(user, user);
      invalidMessageObject = await getInvalidMessageObject();
    });
  
    afterAll(async () => {
      await Users.deleteExistingUser(user._id);
    });

    test("messageCreateValidMessageObjectTrue", async () => {
        let result;
    
        result = await Messages.sendMessage(validMessageObject);
    
        expect(result instanceof APIError).toEqual(false);
      });
    
      test("messageCreateInvalidMessageObjectFalse", async () => {
        let result;
    
        result = await Messages.sendMessage(invalidMessageObject);
    
        expect(result instanceof APIError).toEqual(true);
      });
})

