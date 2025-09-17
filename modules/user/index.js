const router = require("express").Router();
const { userSingUp, userLogin } = require("./controller");

router.post("/signup", userSingUp);
router.post("/login", userLogin);

module.exports = router;
