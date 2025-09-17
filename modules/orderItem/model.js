const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../utils/db");
const Product = require("../product/model");
const Order = require("../order/model");
const { adjustProductStock } = require("../product/service");

const OrderItem = sequelize.define(
  "OrderItem",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    ProductId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    OrderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    hooks: {
      afterSave: async (orderItem, options) => {
        adjustProductStock(orderItem.ProductId, -orderItem.quantity);
        console.log("Stock adjusted for product", orderItem.ProductId);
      },
    },
  }
);

Order.hasMany(OrderItem, { foreignKey: "OrderId" });
OrderItem.belongsTo(Order, { foreignKey: "OrderId" });
Product.hasMany(OrderItem, { foreignKey: "ProductId" });
OrderItem.belongsTo(Product, { foreignKey: "ProductId" });

module.exports = OrderItem;
