const createHttpError = require("http-errors");
const Order = require("./model");
const { checkProductStock, adjustProductStock } = require("../product/service");
const { createOrderItems } = require("../orderItem/service");
const OrderItem = require("../orderItem/model");
const Product = require("../product/model");
const sequelize = require("../../utils/db");

exports.createOrder = async (OrderData, currentUserId) => {
  const Products = OrderData?.Products || [];
  if (Products.length === 0) {
    throw new createHttpError(400, "No products in the order");
  }

  // check stock for each product
  const stocks = await Promise.all(
    Products.map((item) => {
      return checkProductStock(item.ProductId, item.quantity);
    })
  );

  // create order
  const order = await Order.create({ UserId: currentUserId });

  console.log("order-->", order.toJSON());

  // create order items
  return createOrderItems(
    Products.map((item, i) => ({
      OrderId: order.id,
      ProductId: item.ProductId,
      quantity: item.quantity,
      price: stocks[i]?.price,
    }))
  );
};

exports.cancelOrder = async (orderId, currentUserId) => {
  const order = await Order.findByPk(orderId, {
    include: [OrderItem],
  });
  if (!order) {
    throw new createHttpError(404, "Order not found");
  }

  if (order.UserId !== currentUserId) {
    throw new createHttpError(
      403,
      "You are not authorized to cancel this order"
    );
  }

  // update order status
  await order.update({ status: "cancelled" });

  // update stock for each product in the order
  await Promise.all(
    order.OrderItems.map((item) => {
      return adjustProductStock(item.ProductId, item.quantity);
    })
  );
};

exports.getOrderDetails = async (orderId) => {
  const order = await Order.findByPk(orderId, {
    include: [
      {
        model: OrderItem,
        include: [Product],
      },

      // todo: include user details
    ],
  });

  if (!order) {
    throw new createHttpError(404, "Order not found");
  }
  return order;
};

exports.updateOrderStatus = async (orderId, status) => {
  if (status === "cancelled")
    throw new createHttpError(400, "Can not cancel order by this API");

  const order = await Order.findByPk(orderId);
  if (!order) {
    throw new createHttpError(404, "Order not found");
  }
  await order.update({ status });
  return order;
};
