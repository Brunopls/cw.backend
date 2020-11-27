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

const userRoutes = require("./src/routes/usersRoutes");
app.use(passport.initialize());
app.use(passport.session());

app.use(userRoutes.routes());

app.use(cors(options));
app.listen(info.config.port, () =>
  console.log(`Listening on port ${info.config.port}.`)
);
