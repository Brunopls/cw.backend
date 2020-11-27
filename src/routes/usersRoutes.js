const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const Users = require("../models/usersModel");
const { validateUser } = require("../controllers/validationController");
const authenticate = require("../controllers/authenticationController");

const prefix = "/api/v1/users";
const router = Router({ prefix });

async function createUser(ctx) {
  const { body } = ctx.request;
  const result = await Users.addNewUser(body);
  if (result) {
    ctx.status = 201;
    ctx.body = result;
  }
}

async function getAll(ctx) {
  const { body } = ctx.request;
  const result = await Users.getAll();
  ctx.body = body;

  if (result) {
    ctx.status = 200;
    ctx.body = result;
  }
}

async function getById(ctx) {
  const { id } = ctx.params;
  const result = await Users.getByID(id);

  if (result) {
    ctx.status = 200;
    ctx.body = result;
  }
}

async function updateUser(ctx) {
  const { id } = ctx.params;
  const { body } = ctx.request;

  const result = await Users.updateExistingUser(id, body);

  if (result) {
    ctx.status = 204;
    ctx.body = result;
  }
}

async function deleteUser(ctx) {
  const { id } = ctx.params;

  const result = await Users.deleteExistingUser(id);

  if (result) {
    ctx.status = 204;
    ctx.body = result;
  }
}

async function login(ctx) {
  const { id, email, fullName, role } = ctx.state.user;
  const links = {
    self: `${ctx.protocol}://${ctx.host}${prefix}/${id}`,
  };
  ctx.body = { id, email, fullName, role };
}

router.post("/login", authenticate, login);
router.get("/:id", getById);
router.post("/", bodyParser(), validateUser, createUser);
router.get("/", authenticate, getAll);
router.put("/:id", bodyParser(), updateUser);
router.del("/:id", deleteUser);

module.exports = router;
