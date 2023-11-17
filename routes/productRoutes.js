const express = require("express");

const router = express.Router();

// middleware
const { authCheck, adminCheck } = require("../middlewares/authMiddleware");

// controller
const { 
    createProduct, 
    allProductList, 
    deleteProduct, 
    getProduct, 
    updateProduct, 
    productList,
    productsCount,
    productStar
} = require("../controllers/productController");

// routes
router.post("/product", authCheck, adminCheck, createProduct);
router.get("/products/total", productsCount);

router.get("/products/:count", allProductList);
router.delete("/product/:slug", authCheck, adminCheck, deleteProduct);
router.get("/product/:slug", getProduct);
router.put("/product/:slug", authCheck, adminCheck, updateProduct);

router.post("/products", productList);

// rating
router.put("/product/star/:productId", authCheck, productStar)

module.exports = router;