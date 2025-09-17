const orderService = require("./service");

exports.createOrder = async (req, res, next) => {
  try {
    const orderData = req.body;
    const order = await orderService.createOrder(orderData, req.user.id);
    res.status(201).json({
      status: "success",
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.log("Error in createOrder controller", error);
    next(error);
  }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    await orderService.cancelOrder(req.params.id, req.user.id);
    res.status(200).json({
      status: "success",
      message: "Order canceled successfully",
    });
  } catch (error) {
    console.log("Error in cancelOrder controller", error);
    next(error);
  }
};

exports.getOrderDetails = async (req, res, next) => {
  try {
    const order = await orderService.getOrderDetails(req.params.id);
    res.status(200).json({
      status: "success",
      message: "Order details fetched successfully",
      data: order,
    });
  } catch (error) {
    console.log("Error in getOrderDetails controller", error);
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    await orderService.updateOrderStatus(req.params.id, req.body.status);
    res.status(200).json({
      status: "success",
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.log("Error in updateOrderStatus controller", error);
    next(error);
  }
};
