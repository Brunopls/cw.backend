const Koa = require('koa');
const serve = require('koa-static');
const mount = require('koa-mount');
const cors = require("@koa/cors");
const app = new Koa();

const hostname = "photo-shrink-3000.codio-box.uk";
const options = {
  origin: `https://${hostname}`,
};
app.use(cors(options));


app.use(mount('/', serve('./docs/openapi'))) // serve OpenAPI index.html
app.use(mount('/schemas', serve('./src/schemas'))) // serve schemas

let port = process.env.PORT || 3000;
app.listen(port);