const request = require("supertest");
const faker = require("faker");
const Users = require("../models/usersModel");
const Roles = require("../models/rolesModel");
const Messages = require("../models/messagesModel");
const Properties = require("../models/propertiesModel");
const app = require("../../app");

const getMockRole = async function (title) {
  const test = await Roles.getOneByTitle(title);
  return test;
};

const validUserObject = async (role) => {
  const mockedRole = await getMockRole(role);
  return {
    email: faker.internet.email(),
    password: "passw0rd",
    passwordSalt: 10,
    fullName: faker.name.findName(),
    role: mockedRole._id,
  };
};

const validMessageObject = async (user, property) => {
  return {
    text: faker.lorem.paragraph(),
    inquirerEmail: faker.internet.email(),
    user: user._id,
    property: property._id,
  };
};

const validPropertyObject = async (user, category, features) => {
  return {
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    location: faker.address.city(),
    askingPrice: faker.commerce.price(),
    user: user._id,
    propertyCategory: category._id,
    propertyFeatures: features._id,
  };
};

const validPropertyFeatureObject = async () => {
  return {
    title: faker.lorem.word(),
  };
};

const validPropertyCategoryObject = async () => {
  return {
    title: faker.lorem.word(),
  };
};

const invalidMessageObject = async () => {
  return {
    text: faker.lorem.paragraph(),
    // inquirerEmail: faker.internet.email(),
  };
};

const invalidPropertyObject = async () => {
  return {
    description: faker.lorem.paragraph(),
    askingPrice: faker.commerce.price(),
  };
};

const getValidPropertyObject = async (user) => {
  const featureObject = await validPropertyFeatureObject();
  const categoryObject = await validPropertyCategoryObject();
  return await validPropertyObject(user, categoryObject, featureObject);
};

const getValidMessageObject = async (user, property) => {
  const object = await validMessageObject(user, property);
  return object;
};

const getInvalidMessageObject = async () => {
  const object = await invalidMessageObject();
  return object;
};

const getInvalidPropertyObject = async () => {
  const object = await invalidPropertyObject();
  return object;
};

const createUser = async (role) => {
  const userToCreate = await validUserObject(role);
  const user = await Users.addNewUser(userToCreate);

  await request(app.callback())
    .post("/api/users/login")
    .auth(user.email, userToCreate.password)
    .then((res) => {
      user.token = res.body.token;
    })
    .catch((err) => {
      console.log(err);
    });

  return user;
};

const createMessage = async (user, property) => {
  const messageToCreate = await validMessageObject(user, property);
  const message = await Messages.sendMessage(messageToCreate);
  return message;
};

const createProperty = async (user) => {
  const propertyToCreate = await getValidPropertyObject(user);
  const property = await Properties.addNewProperty(propertyToCreate);
  return property;
};

module.exports = {
  getValidMessageObject,
  getValidPropertyObject,
  createUser,
  createMessage,
  createProperty,
  getInvalidMessageObject,
  getInvalidPropertyObject
};
