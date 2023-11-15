const express = require("express");

const router = express.Router();

// middleware
const { authCheck, adminCheck } = require("../middlewares/authMiddleware");

// controller
const { createProduct, AllProductList, deleteProduct, getProduct, updateProduct, productList} = require("../controllers/productController");

// routes
router.post("/product", authCheck, adminCheck, createProduct);
router.get("/products/:count", AllProductList);
router.delete("/product/:slug", authCheck, adminCheck, deleteProduct);
router.get("/product/:slug", getProduct);
router.put("/product/:slug", authCheck, adminCheck, updateProduct);

router.post("/products", productList)

module.exports = router;