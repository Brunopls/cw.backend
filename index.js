/* eslint-disable no-param-reassign, no-console */

const Koa = require("koa");
const cors = require("@koa/cors");
const passport = require("koa-passport");

const app = new Koa();

const hostname = "pyramid-snow-3000.codio-box.uk";
const options = {
  origin: `https://${hostname}`,
  allowMethods: ["GET", "POST", "DELETE", "PUT", "OPTIONS", "PATCH"],
};

const mongoose = require("mongoose");
const info = require("./config");

console.log(`${info.config.DB_HOST}${info.config.DB_DATABASE}`);

mongoose.Promise = global.Promise;
mongoose.connect(
  `${info.config.DB_HOST}${info.config.DB_DATABASE}`,
  info.config.mongoOptions,
  (err) => {
    if (err) throw err;
    console.log("Successfully connected to MongoDB.");
  }
);

mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

app.use(passport.initialize());
app.use(passport.session());

const userRoutes = require("./src/routes/usersRoutes");
const propertiesRoutes = require("./src/routes/propertiesRoutes");
const messagesRoutes = require("./src/routes/messagesRoutes");

app.use(cors(options));
app.use(userRoutes.routes());
app.use(propertiesRoutes.routes());
app.use(messagesRoutes.routes());
app.listen(info.config.port, () => {
  console.log(`Listening on port ${info.config.port}.`);
  console.log(`CORS Origin: ${options.origin}`);
});
