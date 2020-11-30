const AccessControl = require("role-acl");

const ac = new AccessControl();

ac.grant("agent")
  .condition({ Fn: "EQUALS", args: { requester: "$.owner" } })
  .execute("read")
  .on("user", ["*", "!password", "!passwordSalt"]);

ac.grant("agent")
  .condition({ Fn: "EQUALS", args: { requester: "$.owner" } })
  .execute("update")
  .on("user", ["fullName"]);

ac.grant("admin")
  .condition({ Fn: "NOT_EQUALS", args: { requester: "$.owner " } })
  .execute("read")
  .on("user", ["*", "!password", "!passwordSalt"]);

ac.grant("admin")
  .execute("read")
  .on("users", ["*", "!password", "!passwordSalt"]);
ac.grant("admin").execute("update").on("user");

ac.grant("admin")
  .condition({ Fn: "NOT_EQUALS", args: { requester: "$.owner" } })
  .execute("delete")
  .on("user");

exports.readAll = async (requester) => {
  try {
    return await ac.can(requester.role).execute("read").on("users");
  } catch (err) {
    console.log(err);
  }
};

exports.read = (requester, data) => {
  try {
    const context = { requester: requester.user._id, owner: data._id };
    return ac
      .can(requester.role)
      .context(context)
      .execute("read")
      .sync()
      .on("user");
  } catch (err) {
    console.log(err);
  }
};

exports.update = (requester, data) => {
  return ac
    .can(requester)
    .context({ requester: requester._id, owner: data._id })
    .execute("update")
    .sync()
    .on("user");
};

exports.delete = (requester, data) => {
  return ac
    .can(requester)
    .context({ requester: requester._id, owner: data._id })
    .execute("delete")
    .sync()
    .on("user");
};
