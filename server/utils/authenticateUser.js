const jwt = require("jsonwebtoken");
const errorHandler = require("./error");

async function authenticateUser(req, res, next) {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, "unauthorized user"));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, "unauthorized user"));
    }

    req.user = user;
    next();
  }); 
}

module.exports = authenticateUser;
