const User = require('../models/userModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel');
const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.createPaymentIntent = async (req, res) => {
    //
    const paymentIntent = await stripe.paymentIntent.create({
        amount: 100,
        currency: "usd",
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
    });
}