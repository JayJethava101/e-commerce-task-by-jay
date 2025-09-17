const createHttpError = require("http-errors");
const { getUserById } = require("../modules/user/service");
const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  try {
    let token;
    if (!req.headers.authorization?.startsWith("Bearer ")) {
      throw createHttpError(401, "Unauthorized");
    }

    token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // check if user still exists
    const user = getUserById(decodedToken.id);
    if (!user) {
      throw createHttpError(401, "The user no longer exists");
    }
    req.user = decodedToken;
    next();
  } catch (error) {
    next(error);
  }
};

exports.roleMiddleware = (roles) => {
  try {
    return (req, res, next) => {
      if (!roles.includes(req.user?.role)) {
        throw createHttpError(403, "Permission denied!");
      }
      next();
    };
  } catch (error) {
    next(error);
  }
};
