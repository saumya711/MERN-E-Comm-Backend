const express = require("express");

const router = express.Router();

// middleware
const { authCheck, adminCheck } = require("../middlewares/authMiddleware");

// controller
const { 
    create, 
    GetCategory, 
    updateCategory, 
    deleteCategory, 
    getAllCategories,
    getSubCategories
} = require("../controllers/categoryController");

// routes
router.post("/category", authCheck, adminCheck, create);
router.get("/categories", getAllCategories);
router.get("/category/:slug", GetCategory);
router.put("/category/:slug", authCheck, adminCheck, updateCategory);
router.delete("/category/:slug", authCheck, adminCheck, deleteCategory);
router.get("/category/subs/:_id", getSubCategories);


module.exports = router;