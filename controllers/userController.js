const User = require('../models/userModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');

exports.userCart = async (req, res) => {
  // console.log(req.body); //{cart: []}
  const { cart } = req.body;

  let products = [];

  const user = await User.findOne({email: req.user.email }).exec();

  // check if cart with logged in user id alreadt exist
  let cartExistBythisUser = await Cart.findOne({ orderBy: user._id }).exec();

  if (cartExistBythisUser) {
    // cartExistBythisUser.remove();
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