const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const Properties = require("../models/propertiesModel");
const PropertiesCategories = require("../models/propertiesCategoriesModel");
const PropertiesFeatures = require("../models/propertiesFeaturesModel");
const Messages = require("../models/messagesModel");

const { validateProperty } = require("../controllers/validationController");
const authenticate = require("../controllers/authenticationController");

const prefix = "/api/properties";
const router = Router({ prefix });

async function getAll(ctx) {
  let { limit = 10, page = 1 } = ctx.request.query;

  // ensure params are integers
  limit = parseInt(limit);
  page = parseInt(page);

  // validate pagination values to ensure they are sensible
  limit = limit > 100 ? 100 : limit;
  limit = limit < 1 ? 10 : limit;
  page = page < 1 ? 1 : page;

  const result = await Properties.getAll(limit, page);
  const resultFeatures = await PropertiesFeatures.getAll();
  const resultCategories = await PropertiesCategories.getAll();

  if (result) {
    ctx.status = 200;
    ctx.body = { result, resultFeatures, resultCategories };
  }
}

async function getById(ctx) {
  const { id } = ctx.params;
  const result = await Properties.getByID(id);

  if (result) {
    ctx.status = 200;
    ctx.body = result;
  }
}

async function createProperty(ctx) {
  const { body } = ctx.request;
  const result = await Properties.addNewProperty(body);
  if (result) {
    ctx.status = 201;
    ctx.body = result;
  }
}

async function sendMessage(ctx) {
  const { body } = ctx.request;
  const result = await Messages.sendMessage(body);
  if (result) {
    ctx.status = 201;
    ctx.body = result;
  }
}

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", bodyParser(), authenticate, createProperty);
router.post("/message", bodyParser(), sendMessage);

module.exports = router;
