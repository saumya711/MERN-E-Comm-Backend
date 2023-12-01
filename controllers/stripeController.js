const User = require('../models/userModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel');
const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.createPaymentIntent = async (req, res) => {
    //

    // 1 find user
    const user = await User.findOne({ email: req.user.email }).exec();
    // 2 get user cart total
    const { cartTotal } = await Cart.findOne({ orderBy: user._id}).exec();

    console.log("CART TOTAL CHARGED", cartTotal);
    // create payment intent with order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: cartTotal * 100,
        currency: "usd",
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
    });
}