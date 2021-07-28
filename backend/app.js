// Requires
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { sequelize } = require("./models/");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

//const multer = require('multer');
//const upload = multer();

const app = express();
/*const corsOptions = {
  origin: "*"
};*/

//app.use(cors(corsOptions));
app.use(cors());
//Définition des (headers) en-têtes CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("x-powered-by", false);
  //res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});
//for handling form data


app.use(express.json()); // replace app.use(bodyParser.json()) who's deprecated!!
app.use(express.urlencoded({ extended: true }));
// for parsing multipart/form-data
//app.use(upload.array()); 
app.use(express.static('public'));

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
module.exports = app;
