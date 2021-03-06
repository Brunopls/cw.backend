/* eslint radix: 0 */
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const Roles = require("../models/rolesModel");
const Properties = require("../models/propertiesModel");
const PropertiesCategories = require("../models/propertiesCategoriesModel");
const PropertiesFeatures = require("../models/propertiesFeaturesModel");
const Messages = require("../models/messagesModel");

const {
  validateProperty,
  validatePropertyUpdate,
} = require("../controllers/validationController");
const authenticate = require("../controllers/authenticationController");
const permissions = require("../permissions/propertiesPermissions");

const prefix = "/api/properties";
const router = Router({ prefix });

async function getAll(ctx) {
  let { limit = 10, page = 1, query = null, features = null, categories = null, user = null, onlyVisible = true } = ctx.request.query;

  limit = parseInt(limit);
  page = parseInt(page);

  limit = limit > 100 ? 100 : limit;
  limit = limit < 1 ? 10 : limit;
  page = page < 1 ? 1 : page;

  if(features){
    if(features.includes(','))
      features=features.split(',')
    else
      features=[features]
  }

  if(categories){
    if(categories.includes(','))
    categories=categories.split(',')
    else
    categories=[categories]
  }
  
  onlyVisible = ( onlyVisible == "true" );

  const resultCount = await Properties.getCount(categories, features, query, user, onlyVisible);
  const result = await Properties.getAll(limit, page, categories, features, query, user, onlyVisible);
  const resultFeatures = await PropertiesFeatures.getAll();
  const resultCategories = await PropertiesCategories.getAll();

  if (result) {
    ctx.status = 200;
    ctx.body = { result, resultCount, resultFeatures, resultCategories };
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

async function getFeatures(ctx) {
  const result = await PropertiesFeatures.getAll();
  if (result) {
    ctx.status = 200;
    ctx.body = result;
  }
}

async function getCategories(ctx) {
  const result = await PropertiesCategories.getAll();
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

async function updateProperty(ctx, next) {
  const user = ctx.state.user.toJSON();
  const role = await Roles.getByID(user.role);
  user.role = role.title;

  const { id } = ctx.params;
  const property = await Properties.getByID(id);

  if (!property) {
    ctx.status = 404;
    // Redirect to error page
    return next();
  }

  let permission;
  if (String(property.user._id) === String(user._id)) {
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

  const result = await Properties.updateExistingProperty(id, body);

  if (result) {
    ctx.status = 204;
    ctx.body = result;
  }
}

async function deleteProperty(ctx, next) {
  const { id } = ctx.params;
  const user = ctx.state.user.toJSON();
  const role = await Roles.getByID(user.role);
  user.role = role.title;

  const property = await Properties.getByID(id);

  if (!property) {
    ctx.status = 404;
    // Redirect to error page
    return next();
  }

  let permission;
  if (String(property.user._id) === String(user._id)) {
    permission = permissions.deleteOwn(user);
  } else {
    permission = permissions.deleteAny(user);
  }
  if (!permission.granted) {
    ctx.status = 403;
    // Redirect to error page
    return next();
  }

  const result = await Properties.deleteExistingProperty(id);

  if (result) {
    ctx.status = 204;
    ctx.body = result;
  }
}

router.get("/", getAll);
router.get("/get/:id", getById);
router.get("/features/", getFeatures);
router.get("/categories/", getCategories);
router.del("/:id", authenticate, deleteProperty);
router.put(
  "/:id",
  bodyParser(),
  validatePropertyUpdate,
  authenticate,
  updateProperty
);
router.post("/", bodyParser(), validateProperty, authenticate, createProperty);
router.post("/message", bodyParser(), sendMessage);

module.exports = router;
