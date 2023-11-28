const express = require("express");

const router = express.Router();

// middleware
const { authCheck, adminCheck } = require("../middlewares/authMiddleware");

// controller
const { createCoupon, deleteCoupon, getAllCoupons } = require("../controllers/couponController");

// routes
router.post("/coupon", authCheck, adminCheck, createCoupon);
router.get("/coupons", getAllCoupons);
router.delete("/coupon/:couponId", authCheck, adminCheck, deleteCoupon);


module.exports = router;