const AccessControl = require("accesscontrol");
const fs = require('fs');

let grants = fs.readFileSync('src/permissions/grants.json');
grants = JSON.parse(grants)

const ac = new AccessControl(grants);

// ac.grant("agent").readOwn("user").updateOwn("user").deleteOwn("user");

// ac.grant("admin")
//   .readAny("user", ["*", "!password", "!passwordSalt"])
//   .deleteAny("user");

exports.readAll = (requester) => {
  try {
    return ac.can(requester.role).readAny("users");
  } catch (err) {
    console.log(err);
  }
};

exports.readOwn = (requester) => {
  try {
    return ac.can(requester.role).readOwn("users");
  } catch (err) {
    console.log(err);
  }
};

exports.updateAll = (requester) => {
  try {
    return ac.can(requester.role).updateAny("users");
  } catch (err) {
    console.log(err);
  }
};

exports.updateOwn = (requester) => {
  try {
    return ac.can(requester.role).updateOwn("users");
  } catch (err) {
    console.log(err);
  }
};

exports.deleteAny = (requester) => {
  try {
    return ac.can(requester.role).deleteAny("users");
  } catch (err) {
    console.log(err);
  }
};

exports.deleteOwn = (requester) => {
  try {
    return ac.can(requester.role).deleteOwn("users");
  } catch (err) {
    console.log(err);
  }
};