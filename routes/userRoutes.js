const express = require("express");

const router = express.Router();

// middleware
const { authCheck } = require("../middlewares/authMiddleware");

// controller
const { userCart, getUserCart } = require("../controllers/userController");


router.post("/user/cart", authCheck, userCart);
router.get("/user/cart", authCheck, getUserCart);

// router.get("/user", (req, res) => {
//     res.json({
//         data: "hey you hit user API rndpoint",
//     });
// });

module.exports = router;