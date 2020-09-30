const Koa = require("koa");
const app = new Koa();
const info = require("./config");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect(info.config.connectionStr, info.config.mongoOptions, function (
  err
) {
  if (err) throw err;
  console.log("Successfully connected to MongoDB.");
});

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);


let port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}.`));

