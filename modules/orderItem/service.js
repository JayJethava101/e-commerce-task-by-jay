const OrderItem = require("./model");

exports.createOrderItems = async (orderItemData) => {
  const orderItem = await OrderItem.bulkCreate(orderItemData, {
    individualHooks: true,
  });
  return orderItem;
};
