exports.config = {
  port: process.env.DB_PORT || 3000,
  database: process.env.DB_DATABASE || "mongodb://localhost/blog_db",

  mongoOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};
