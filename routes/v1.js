const router = require("express").Router();

router.use("/users", require("../modules/user"));
router.use("/products", require("../modules/product"));
router.use("/orders", require("../modules/order"));
router.use("/order-items", require("../modules/orderItem"));

module.exports = router;
