const router = require("express").Router();
const {
  createOrder,
  getOrderDetails,
  cancelOrder,
  updateOrderStatus,
} = require("./controller");
const { authMiddleware, roleMiddleware } = require("../../middleware/auth");

router.use(authMiddleware);

router.patch("/:id/cancel", cancelOrder);
router.get("/:id", getOrderDetails);
router.patch("/:id", roleMiddleware(["admin"]), updateOrderStatus);
router.post("/", createOrder);

module.exports = router;
