exports.config = {
<<<<<<< HEAD
  connectionStr: "mongodb://localhost/blog_db",
=======
  port: process.env.DB_PORT || 3000,
  database: process.env.DB_DATABASE || "mongodb://localhost/blog_db",

>>>>>>> architecture/models
  mongoOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};
