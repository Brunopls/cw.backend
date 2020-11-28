/* eslint-disable no-param-reassign, no-console */
const fs = require('fs');
let grants = fs.readFileSync('src/permissions/grants.json');

grants = JSON.parse(grants)

console.log(grants)

const Koa = require("koa");
const cors = require("@koa/cors");
const passport = require("koa-passport");

const hostname = "photo-shrink-3000.codio-box.uk";
const options = {
  origin: `https://${hostname}`,
};

const app = new Koa();
const mongoose = require("mongoose");
const info = require("./config");

mongoose.Promise = global.Promise;
mongoose.connect(info.config.database, info.config.mongoOptions, (err) => {
  if (err) throw err;
  console.log("Successfully connected to MongoDB.");
});

mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

app.use(passport.initialize());
app.use(passport.session());

const userRoutes = require("./src/routes/usersRoutes");
const propertiesRoutes = require("./src/routes/propertiesRoutes");
const messagesRoutes = require("./src/routes/messagesRoutes");

app.use(userRoutes.routes());
app.use(propertiesRoutes.routes());
app.use(messagesRoutes.routes());

app.use(cors(options));
app.listen(info.config.port, () =>
  console.log(`Listening on port ${info.config.port}.`)
);
