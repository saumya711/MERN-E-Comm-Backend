const express = require("express");

const router = express.Router();

// middleware
const { authCheck } = require("../middlewares/authMiddleware");

// controller
const { userCart } = require("../controllers/userController");


router.post("/cart", authCheck, userCart);

// router.get("/user", (req, res) => {
//     res.json({
//         data: "hey you hit user API rndpoint",
//     });
// });

module.exports = router;