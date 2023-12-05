const User = require('../models/userModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel');
const Order = require('../models/orderModel');
const uniqueid = require("uniqueid");

exports.userCart = async (req, res) => {
  // console.log(req.body); //{cart: []}
  const { cart } = req.body;

  let products = [];

  const user = await User.findOne({email: req.user.email }).exec();

  // check if cart with logged in user id alreadt exist
  let cartExistBythisUser = await Cart.findOne({ orderBy: user._id }).exec();

  if (cartExistBythisUser) {
    // cartExistBythisUser.remove(); // not available remove()
    // console.log('removed old cart');

    // fixed error
    await Cart.deleteOne({ orderBy: user._id }).exec();
    console.log('Removed old cart');
  }

  for (let i = 0; i < cart.length; i++) {
    let object = {};

    object.product = cart[i]._id;
    object.count = cart[i].count;
    object.color = cart[i].color;
    // get price for creating total
    let { price } = await Product.findById(cart[i]._id).select("price").exec();
    object.price = price;

    products.push(object);
  }

  // console.log('products', products);

  let cartTotal = 0;
  for (let i = 0; i < products.length; i++) {
    cartTotal = cartTotal + products[i].price * products[i].count;
  }

  // console.log("cartTotal", cartTotal);

  let newCart = await new Cart({
    products,
    cartTotal,
    orderBy: user._id,
  }).save();

  console.log('new cart', newCart);
  res.json({ ok: true });
}

exports.getUserCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();

  let cart = await Cart.findOne({ orderBy: user._id })
    .populate("products.product", "_id title price totalAfterDiscount")
    .exec();

    const { products, cartTotal, totalAfterDiscount } = cart;
    res.json({ products, cartTotal, totalAfterDiscount });
}

exports.emptyCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();

  const cart = await Cart.findOneAndDelete({ orderBy: user._id }).exec();
  res.json(cart);
}

exports.saveAddress = async (req, res) => {
  const userAddress = await User.findOneAndUpdate(
    { email: req.user.email },
    { address: req.body.address }
  ).exec();

  res.json({ ok: true });
}

// Coupon
exports.applyCouponToUserCart = async (req, res) => {
  const { coupon } = req.body;
  console.log("COUPON", coupon);

  const validCoupon = await Coupon.findOne({ name: coupon }).exec();
  if (validCoupon === null) {
    return res.json({
      err: "Invalid coupon",
    });
  }
  console.log("VALID COUPON", validCoupon);

  const user = await User.findOne({ email: req.user.email }).exec();

  let { products, cartTotal } = await Cart.findOne({ orderBy: user._id})
  .populate("products.product", "_id price")
  .exec();

  console.log("cartTotal", cartTotal , "discount%", validCoupon.discount);

  // calculate the total aafter discount
  let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2);

  Cart.findOneAndUpdate({ orderBy: user._id}, {totalAfterDiscount}, {new:true}).exec();

  res.json(totalAfterDiscount);
}

// Order
exports.createOrder = async (req, res) => {
  const { paymentIntent } = req.body.stripeResponse;
  const user = await User.findOne({ email: req.user.email }).exec();

  let { products } = await Cart.findOne({ orderBy: user._id }).exec();

  let newOrder = await new Order({
    products,
    paymentIntent,
    orderBy: user._id,
  }).save();

  // decrement quantiyi, increment sold
  let bulkOption = products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id }, // IMPORTANT item.product
        update: { $inc: { quantity: -item.count, sold: +item.count }},
      },
    };
  });

  let updated = await Product.bulkWrite(bulkOption, {});
  console.log("PRODUCT QUANTITY-- AND SOLD++", updated);

  console.log("NEW ORDER SAVED", newOrder);
  res.json({ ok: true });
}

// COD 
exports.createCashOrder = async (req, res) => {
  const { COD, couponApplied } = req.body;
  // if COD is true, create order with status of Cash On Delivery
  if (!COD) return res.status(400).send("Create cash order failed");

  const user = await User.findOne({ email: req.user.email }).exec();

  let userCart = await Cart.findOne({ orderBy: user._id }).exec();

  let finalAmount = 0;

  if (couponApplied && userCart.totalAfterDiscount) {
    finalAmount = userCart.totalAfterDiscount * 100;
  } else {
    finalAmount = userCart.cartTotal * 100;
  }

  let newOrder = await new Order({
    products: userCart.products,
    paymentIntent: {
      id: uniqueid(),
      amount: finalAmount,
      currency: "usd",
      status: "Cash On Delivery",
      created: Date.now(),
      payment_method_types: ["cash"],
    },
    orderBy: user._id,
    orderStatus: "Cash On Delivery",
  }).save();

  // decrement quantiyi, increment sold
  let bulkOption = userCart.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id }, // IMPORTANT item.product
        update: { $inc: { quantity: -item.count, sold: +item.count }},
      },
    };
  });

  let updated = await Product.bulkWrite(bulkOption, {});
  console.log("PRODUCT QUANTITY-- AND SOLD++", updated);

  console.log("NEW ORDER SAVED", newOrder);
  res.json({ ok: true });
}

exports.getUserOrders = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();

  let userOrders = await Order.find({ orderBy: user._id })
    .populate("products.product")
    .exec();

    res.json(userOrders);
}

// wishlist
exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;

  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $addToSet: { wishList: productId }}
  ).exec();

  res.json({ ok: true });
}

exports.wishlist = async (req, res) => {
  const list = await User.findOne({ email: req.user.email }) 
  .select("wishList")
  .populate("wishList")
  .exec();

  res.json(list);
}

exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.params;

  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $pull: { wishList: productId }}
  ).exec();

  res.json({ ok: true });
}