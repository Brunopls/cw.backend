/* eslint consistent-return: 0 */
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const Messages = require("../models/messagesModel");
const Roles = require("../models/rolesModel");

const authenticate = require("../controllers/authenticationController");
const permissions = require("../permissions/messagesPermissions");

const prefix = "/api/messages";
const router = Router({ prefix });

async function getById(ctx, next) {
  const { id } = ctx.params;
  const user = JSON.parse(JSON.stringify(ctx.state.user.toJSON()));
  const role = await Roles.getByID(user.role);
  user.role = role.title;
  const result = await Messages.getByID(id);

  let permission;
  if (String(result.user) === String(user._id)) {
    permission = permissions.readOwn(user);
  } else {
    permission = permissions.readAll(user);
  }

  if (!permission.granted) {
    ctx.status = 403;
    // Redirect to error page
    return next();
  }

  if (result) {
    ctx.status = 200;
    ctx.body = result;
  }
}

async function getAll(ctx, next) {
  let { limit = 10, page = 1, showArchived = false } = ctx.request.query;
  const user = ctx.state.user.toJSON();
  const role = await Roles.getByID(user.role);
  user.role = role.title;

  const permission = permissions.readOwn(user);
  if (!permission.granted) {
    ctx.status = 403;
    return next();
  }
  
  showArchived = ( showArchived == "true" );

  const result = await Messages.getAll(user, limit, page, showArchived);
  const resultCount = await Messages.getCount(user, showArchived);

  if (result) {
    ctx.status = 200;
    ctx.body = {result,resultCount};
  }
}

async function updateMessage(ctx, next) {
  const user = ctx.state.user.toJSON();
  const role = await Roles.getByID(user.role);
  user.role = role.title;
  const { id } = ctx.params;
  const message = await Messages.getByID(id);

  if (!message) {
    ctx.status = 404;
    // Redirect to error page
    return next();
  }

  let permission;
  if (String(message.user._id) === String(user._id)) {
    permission = permissions.updateOwn(user);
  } else {
    permission = permissions.updateAll(user);
  }

  if (!permission.granted) {
    ctx.status = 403;
    // Redirect to error page
    return next();
  }

  const { body } = ctx.request;

  const result = await Messages.updateExistingMessage(id, body);

  if (result) {
    ctx.status = 204;
    ctx.body = result;
  }
}

async function archiveMessage(ctx, next) {
  const user = ctx.state.user.toJSON();
  const role = await Roles.getByID(user.role);
  user.role = role.title;
  const { id } = ctx.params;
  const message = await Messages.getByID(id);
  

  if (!message) {
    ctx.status = 404;
    // Redirect to error page
    return next();
  }

  let permission;
  if (String(message.user._id) === String(user._id)) {
    permission = permissions.updateOwn(user);
  } else {
    permission = permissions.updateAll(user);
  }

  if (!permission.granted) {
    ctx.status = 403;
    // Redirect to error page
    return next();
  }

  message.archived = true;
  const result = await Messages.updateExistingMessage(id, message);

  if (result) {
    ctx.status = 204;
    ctx.body = result;
  }
}

async function deleteMessage(ctx, next) {
  const { id } = ctx.params;
  const user = ctx.state.user.toJSON();
  const role = await Roles.getByID(user.role);
  user.role = role.title;

  const message = await Messages.getByID(id);

  if (!message) {
    ctx.status = 404;
    // Redirect to error page
    return next();
  }

  let permission;
  if (String(message.user._id) === String(user._id)) {
    permission = permissions.deleteOwn(user);
  } else {
    permission = permissions.deleteAny(user);
  }
  if (!permission.granted) {
    ctx.status = 403;
    // Redirect to error page
    return next();
  }

  const result = await Messages.deleteExistingMessage(id);

  if (result) {
    ctx.status = 204;
    ctx.body = result;
  }
}

router.get("/", authenticate, bodyParser(), getAll);
router.get("/:id", authenticate, getById);
router.del("/:id", authenticate, deleteMessage);
router.put("/:id", bodyParser(), authenticate, updateMessage);
router.put("/archive/:id", authenticate, archiveMessage);

module.exports = router;
