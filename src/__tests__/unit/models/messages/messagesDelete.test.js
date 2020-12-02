const Users = require("../../../../models/usersModel");
const Messages = require("../../../../models/messagesModel");
const {
  createMessage,
  createUser,
} = require("../../../../helpers/integrationTestsHelper");
const APIError = require("../../../../helpers/apiErrorHandling");

describe("messageDeleteUnitTests", () => {
    let user;
    let messageToDelete;
  
    beforeAll(async () => {
      user = await createUser("agent");
      messageToDelete = await createMessage(user, user);
    });
  
    afterAll(async () => {
      await Users.deleteExistingUser(user._id);
    });

    test("messageDeleteValidTrue", async () => {
        let result;
    
        result = await Messages.deleteExistingMessage(messageToDelete.newMessage._id);
    
        expect(result instanceof APIError).toEqual(false);
      });
    
      test("messageDeleteInvalidFalse", async () => {
        let result;
    
        result = await Messages.deleteExistingMessage("user._id");
    
        expect(result instanceof APIError).toEqual(true);
      });
})