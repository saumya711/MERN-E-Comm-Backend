const express = require("express");

const router = express.Router();

const { createOrUpdateUser, currentUser } = require("../controllers/authController");
const { authCheck } = require("../middlewares/authMiddleware");

router.post("/create-or-update-user", authCheck, createOrUpdateUser);
router.post("/current-user", authCheck, currentUser);

module.exports = router;