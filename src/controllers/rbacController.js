const canUser = require("../permissions/usersPermissions");

const usersRBAC = async (action, user, data = null) => {
  try {
    switch (action) {
      case "readAll":
        result = await canUser.readAll(user);
        break;
      case "read":
        result = await canUser.read(user, data);
        break;
      case "update":
        result = await canUser.update(user, data);
        break;
      case "delete":
        result = await canUser.delete(user, data);
        break;
      default:
        result = false;
    }
    return result;
  } catch (err) {
    return false;
  }
};

module.exports = {
  usersRBAC,
};
