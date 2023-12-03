const express = require("express");

const router = express.Router();

// middleware
const { authCheck, adminCheck } = require("../middlewares/authMiddleware");

// controller
const { getOrders, updateOrderStatus} = require("../controllers/adminController");

// routes
router.get("/admin/orders", authCheck, adminCheck, getOrders);
router.put("/admin/update-order-status", authCheck, adminCheck, updateOrderStatus);

module.exports = router;