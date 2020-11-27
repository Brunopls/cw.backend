exports.config = {
  port: process.env.DB_PORT || 3000,
  database: process.env.DB_DATABASE || "mongodb://localhost/wesellhousesDB",

  mongoOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};
