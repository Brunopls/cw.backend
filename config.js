exports.config = {
  port: process.env.DB_PORT || 3000,
  database: process.env.DB_DATABASE || "mongodb://localhost/wesellhousesDB",
  jwtSecret: process.env.JWT_SECRET || "secreto",
  mongoOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};
