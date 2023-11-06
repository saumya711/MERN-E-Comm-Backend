const express = require("express");
const router = express.Router();

// middleware
const { authCheck, adminCheck } = require("../middlewares/authMiddleware");

//controllers
const { uploadImages, removeImage } = require("../controllers/cloudinaryController");

router.post("/upload-images", authCheck, adminCheck, uploadImages);
router.delete("/delete-images", authCheck, adminCheck, removeImage);

module.exports = router;