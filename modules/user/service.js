const createHttpError = require("http-errors");
const User = require("./model");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.userSingUp = async (userData) => {
  if (await User.count({ where: { email: userData.email } })) {
    throw createHttpError.Conflict("Email already exists");
  }
  userData.password = await bcrypt.hash(userData.password, 10);
  return User.create(userData);
};

exports.userLogin = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw createHttpError.NotFound("Incorrect credentials");

  const isCorrectPass = await bcrypt.compare(password, user.password);

  if (!isCorrectPass) {
    throw createHttpError.Unauthorized("Incorrect credentials");
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );

  return token;
};

exports.getUserById = (id) => {
  return User.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
};
