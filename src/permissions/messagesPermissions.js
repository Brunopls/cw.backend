/* eslint consistent-return: 0 */
const AccessControl = require("accesscontrol");
const fs = require("fs");

let grants = fs.readFileSync("src/permissions/grants.json");
grants = JSON.parse(grants);

const ac = new AccessControl(grants);

exports.readAll = (requester) => {
  try {
    return ac.can(requester.role).readAny("messages");
  } catch (err) {
    console.log(err);
  }
};

exports.readOwn = (requester) => {
  try {
    return ac.can(requester.role).readOwn("messages");
  } catch (err) {
    console.log(err);
  }
};

exports.updateAll = (requester) => {
  try {
    return ac.can(requester.role).updateAny("messages");
  } catch (err) {
    console.log(err);
  }
};

exports.updateOwn = (requester) => {
  try {
    return ac.can(requester.role).updateOwn("messages");
  } catch (err) {
    console.log(err);
  }
};

exports.deleteAny = (requester) => {
  try {
    return ac.can(requester.role).deleteAny("messages");
  } catch (err) {
    console.log(err);
  }
};

exports.deleteOwn = (requester) => {
  try {
    return ac.can(requester.role).deleteOwn("messages");
  } catch (err) {
    console.log(err);
  }
};
