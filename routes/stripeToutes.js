const express = require("express");

const router = express.Router();

// middleware
const { authCheck } = require("../middlewares/authMiddleware");

// controller
const { createPaymentIntent } = require("../controllers/stripeCOntroller");

// routes
router.post("/create-payment-intent", authCheck, createPaymentIntent);

module.exports = router;