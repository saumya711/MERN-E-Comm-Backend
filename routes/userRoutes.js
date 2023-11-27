const express = require("express");

const router = express.Router();

// middleware
const { authCheck } = require("../middlewares/authMiddleware");

// controller
const { userCart, getUserCart, emptyCart } = require("../controllers/userController");


router.post("/user/cart", authCheck, userCart); // save cart
router.get("/user/cart", authCheck, getUserCart); // get cart
router.delete("/user/cart", authCheck, emptyCart); // empty cart

// router.get("/user", (req, res) => {
//     res.json({
//         data: "hey you hit user API rndpoint",
//     });
// });

module.exports = router;