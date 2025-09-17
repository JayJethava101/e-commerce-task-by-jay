const { Sequelize } = require("sequelize");

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize("e-commerce", "postgres", "password", {
  host: "localhost",
  dialect: "postgres",
});

module.exports = sequelize;
