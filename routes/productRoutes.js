const express = require("express");

const router = express.Router();

// middleware
const { authCheck, adminCheck } = require("../middlewares/authMiddleware");

// controller
const { createProduct, ProductList} = require("../controllers/productController");

// routes
router.post("/product", authCheck, adminCheck, createProduct);
router.get("/products/:count", ProductList);


module.exports = router;