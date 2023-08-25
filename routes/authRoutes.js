const express = require("express");

const router = express.Router();

const { createOrUpdateUser } = require("../controllers/authController");
const { authCheck } = require("../middlewares/authMiddleware");

router.post("/create-or-update-user", authCheck, createOrUpdateUser);

module.exports = router;