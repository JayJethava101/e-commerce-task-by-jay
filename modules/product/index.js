const router = require("express").Router();
const { createProduct, getAllProducts } = require("./controller");
const { authMiddleware, roleMiddleware } = require("../../middleware/auth");

router.use(authMiddleware);

router.post("/", roleMiddleware(["admin"]), createProduct);
router.get("/", getAllProducts);
module.exports = router;
