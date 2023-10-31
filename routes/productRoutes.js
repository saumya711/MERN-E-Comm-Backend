const express = require("express");

const router = express.Router();

// middleware
const { authCheck, adminCheck } = require("../middlewares/authMiddleware");

// controller
const { createProduct} = require("../controllers/productController");

// routes
router.post("/product", authCheck, adminCheck, createProduct);


module.exports = router;