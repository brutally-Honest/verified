const jwt = require("jsonwebtoken");
const UserAuth = require("../models/userAuth-model");
const { AuthError, APIError } = require("../utils/errors");
const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    const tokenData = jwt.verify(token, process.env.JWT_KEY);
    req.user = tokenData;
    next();
  } catch (e) {
    const err=new AuthError("Invalid Token",400)
    next(err);
  }
};
const authorizeUser = (roles) => async (req, res, next) => {
  try {
    const user = await UserAuth.findById(req.user.id);
    if (roles.includes(user.role)) next();
    else throw new AuthError("Access Forbidden", 403);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  authenticateUser,
  authorizeUser,
};
