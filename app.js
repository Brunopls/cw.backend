const Koa = require('koa');
const cors = require('@koa/cors');
const passport = require("koa-passport");

const app = new Koa();

const hostname = "photo-shrink-3000.codio-box.uk";
const options = {
  origin: `https://${hostname}`,
};
app.use(cors(options));

const mongoose = require("mongoose");
const userRoutes = require("./src/routes/usersRoutes");
const propertiesRoutes = require("./src/routes/propertiesRoutes");
const messagesRoutes = require("./src/routes/messagesRoutes");

const info = require("./config");

mongoose.Promise = global.Promise;
mongoose.connect(`${info.config.DB_HOST}${info.config.DB_DATABASE_TEST}`, info.config.mongoOptions, (err) => {
  if (err) throw err;
});

mongoose.set('useCreateIndex', true);
mongoose.set("useFindAndModify", false);

app.use(passport.initialize());
app.use(passport.session());

app.use(userRoutes.routes());
app.use(propertiesRoutes.routes());
app.use(messagesRoutes.routes());


module.exports = app;