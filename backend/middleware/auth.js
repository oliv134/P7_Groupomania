const jwt = require("jsonwebtoken");
require("dotenv").config();
const db = require("../models");
const { User } = db.sequelize.models;
// Middleware used for validate authentication on all routes
exports.checkToken = (req, res, next) => {
  try {
    const userId = req.headers.userid;
    const tokenUserId = this.getTokenUserId(req);
    if (userId && userId != tokenUserId) {
      throw "Invalid user ID";
    } else {
      //User.findOne({ where: { id: userId } }).then((user) => {
      //req.user = user;
      next();
      //});
    }
  } catch (error) {
    res.status(401).json({ error: error | "Invalid Request" });
  }
};

exports.setToken = (user) => {
  // on génére le token
  const payload = {
    userId: user.id,
  };
  token = jwt.sign(payload, process.env.TOKEN_KEY, {
    expiresIn: process.env.TOKEN_EXPIRE,
  });
  console.log("middleware/Auth:token: " + token);
  return "Bearer " + token;
  /*return {
    token: signedToken,
    expires: expiresIn,
  };*/
};

exports.getToken = (req) => {
  return req.headers.authorization.split(" ")[1];
};
exports.getTokenUserId = (req) => {
  // on vérifie le userId du token
  const decodedToken = jwt.verify(this.getToken(req), process.env.TOKEN_KEY); // on le vérifie
  console.log(decodedToken)
  return decodedToken.userId;; // on récupère l'id du token
};
exports.checkUser = (req) => {
  // vérifie si l'id du user passé dans le header est correct
  console.log(req.headers.userid);
  return this.getTokenUserId(req) === req.headers.userid

}