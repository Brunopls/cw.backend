const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const Messages = require("../models/messagesModel");

const authenticate = require("../controllers/authenticationController");

const prefix = "/api/messages";
const router = Router({ prefix });

async function getById(ctx) {
  const { id } = ctx.params;
  console.log(id);
  const result = await Messages.getByID(id);

  if (result) {
    ctx.status = 200;
    ctx.body = result;
  }
}

async function getAll(ctx) {
  const { limit = 10, page = 1 } = ctx.request.query;
  const { user } = ctx.request.body;
  const result = await Messages.getAll(user, limit, page);

  if (result) {
    ctx.status = 200;
    ctx.body = result;
  }
}

router.get("/", bodyParser(), getAll);
router.get("/:id", getById);

module.exports = router;
