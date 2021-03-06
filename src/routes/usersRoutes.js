/* eslint consistent-return: 0 */
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const Users = require("../models/usersModel");
const Roles = require("../models/rolesModel");
const SignUpCodes = require("../models/signUpCodesModel");
const {
  validateUser,
  validateUserUpdate,
} = require("../controllers/validationController");
const authenticate = require("../controllers/authenticationController");
const { generateJWT } = require("../helpers/authenticationHelper");
const permissions = require("../permissions/userPermissions");

const prefix = "/api/users";
const router = Router({ prefix });

async function createUser(ctx) {
  const { body } = ctx.request;
  body.passwordSalt = 10;
  const signUpCodeIsValid = await SignUpCodes.existsAndIsValid(body.signUpCode);
  if (signUpCodeIsValid) {
    const agentRole = await Roles.getOneByTitle('agent');
    body.role = agentRole;
    let result = await Users.addNewUser(body);
    if (result) {
      result = result.toJSON();
      result.token = generateJWT(result);
      ctx.status = 201;
      ctx.body = { user: result, token: generateJWT(result) };
    }
  } else {
    ctx.status = 400;
  }
}

async function getAll(ctx, next) {
  try {
    const user = ctx.state.user.toJSON();
    const role = await Roles.getByID(user.role);
    user.role = role.title;
    const permission = permissions.readAll(user);

    if (!permission.granted) {
      ctx.status = 403;
      return next();
    }
    // Converting Mongoose document to JSON so that it can be used in
    const result = JSON.parse(JSON.stringify(await Users.getAll()));
    if (result) {
      ctx.status = 200;
      ctx.body = permission.filter(result);
    }
  } catch (err) {
    console.log(err);
  }
}

async function getById(ctx, next) {
  const { id } = ctx.params;
  const user = ctx.state.user.toJSON();
  const role = await Roles.getByID(user.role);
  user.role = role.title;

  let permission;
  if (String(id) === String(user._id)) {
    permission = permissions.readOwn(user);
  } else {
    permission = permissions.readAll(user);
  }

  if (!permission.granted) {
    ctx.status = 403;
    // Redirect to error page
    return next();
  }

  const result = JSON.parse(JSON.stringify(await Users.getByID(id)));

  if (result) {
    ctx.status = 200;
    ctx.body = permission.filter(result);
  }
}

async function updateUser(ctx, next) {
  const user = ctx.state.user.toJSON();
  const role = await Roles.getByID(user.role);
  user.role = role.title;
  const { id } = ctx.params;

  let permission;
  if (String(id) === String(user._id)) {
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

  const result = await Users.updateExistingUser(id, body);

  if (result) {
    ctx.status = 204;
    ctx.body = result;
  }
}

async function deleteUser(ctx, next) {
  const { id } = ctx.params;
  const user = ctx.state.user.toJSON();
  const role = await Roles.getByID(user.role);
  user.role = role.title;

  let permission;
  if (String(id) === String(user._id)) {
    permission = permissions.deleteOwn(user);
  } else {
    permission = permissions.deleteAny(user);
  }
  if (!permission.granted) {
    ctx.status = 403;
    // Redirect to error page
    return next();
  }

  const result = await Users.deleteExistingUser(id);

  if (result) {
    ctx.status = 204;
    ctx.body = result;
  }
}

async function login(ctx) {
  const links = {
    self: `${ctx.protocol}://${ctx.host}${prefix}/${ctx.state.user.id}`,
  };
  ctx.body = { id: ctx.state.user._id, token: generateJWT(ctx.state.user), links };
}

router.post("/login", authenticate, login);
router.get("/:id", authenticate, getById);
router.post("/", bodyParser(), validateUser, createUser);
router.get("/", authenticate, getAll);
router.put("/:id", bodyParser(), validateUserUpdate, authenticate, updateUser);
router.del("/:id", authenticate, deleteUser);

module.exports = router;
