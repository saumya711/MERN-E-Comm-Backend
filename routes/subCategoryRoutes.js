const express = require("express");

const router = express.Router();

// middleware
const { authCheck, adminCheck } = require("../middlewares/authMiddleware");

// controller
const { createSubCategory, GetSubCategory, updateSubCategory, deleteSubCategory, getAllSubCategories} = require("../controllers/subCategoryController");

// routes
router.post("/sub-category", authCheck, adminCheck, createSubCategory);
router.get("/sub-categories", getAllSubCategories);
router.get("/sub-category/:slug", GetSubCategory);
router.put("/sub-category/:slug", authCheck, adminCheck, updateSubCategory);
router.delete("/sub-category/:slug", authCheck, adminCheck, deleteSubCategory);


module.exports = router;