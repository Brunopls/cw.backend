const Koa = require("koa");

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

<<<<<<< HEAD
<<<<<<< HEAD
let port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}.`));
=======
app.listen(info.config.port, () => console.log(`Listening on port ${info.config.port}.`));
>>>>>>> architecture/models
=======
app.listen(info.config.port, () =>
  console.log(`Listening on port ${info.config.port}.`)
);
>>>>>>> architecture/models
