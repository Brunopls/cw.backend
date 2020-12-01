exports.config = {
  port: process.env.DB_PORT || 3000,
  DB_DATABASE: "wesellhousesDB",
  DB_DATABASE_TEST: "test-wesellhousesDB",
  DB_HOST: "mongodb://localhost/",
  jwtSecret: process.env.JWT_SECRET || "secreto",
  mongoOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};
