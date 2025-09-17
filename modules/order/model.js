const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../utils/db");
const User = require("../user/model");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "shipped", "delivered", "cancelled"),
      defaultValue: "pending",
    },
    UserId: {
      type: DataTypes.INTEGER,
      // allowNull: false
    },
  },
  {
    timestamps: true,
  }
);

User.hasMany(Order, { foreignKey: "UserId" });
Order.belongsTo(User, { foreignKey: "UserId" });

module.exports = Order;
