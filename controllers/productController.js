const Product = require("../models/productModel");
const User = require("../models/userModel");
const slugify = require("slugify");

exports.createProduct = async (req, res) => {
    try {
        console.log(req.body);
        req.body.slug = slugify(req.body.title);
        const newProduct = await new Product(req.body).save();
        res.json(newProduct);
    } catch (err) {
        console.log(err);
        //res.status(400).send("Create Product Failed");
        res.status(400).json({
            err: err.message
        });
    }
};

exports.allProductList = async (req, res) => {
    let products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate('category')
    .populate('subs')
    .sort([["createdAt", "desc"]])
    .exec();
    res.json(products);
};

exports.deleteProduct = async (req, res) => {
    try {
       const deleted = await Product.findOneAndRemove({slug: req.params.slug}).exec();
       res.json(deleted);
    } catch (err) {
       console.log(err);
       return res.status(400).send("Product Delete Failed");
    }
};

exports.getProduct = async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug })
        .populate('category')
        .populate('subs')
        .exec();
    res.json(product);
};

exports.updateProduct = async (req, res) => {
    try {
       if(req.body.title) {
        req.body.slug = slugify(req.body.title);
       } 
       const updated = await Product.findOneAndUpdate({ 
            slug: req.params.slug}, req.body, { new: true
        }).exec();
        res.json(updated);
    } catch (err) {
        console.log(err);
        //return res.status(400).send("Product Update Failed");  
        res.status(400).json({
            err: err.message
        });
    }
};


// WITHOUT PAGINATION
// exports.productList = async (req, res) => {
//     try {
//         // createdAt/updatetAt, desc/asc, 3
//         const { sort, order, limit} = req.body;
//         const products = await Product.find({})
//         .populate("category")
//         .populate("subs")
//         .sort([[sort, order]])
//         .limit(limit)
//         .exec();

//         res.json(products);
//     } catch (err) {
//         console.log(err);
//     }
// };


// WITH PAGINATION
exports.productList = async (req, res) => {
    // console.table(req.body);
    try {
        // createdAt/updatetAt, desc/asc, 3
        const { sort, order, page} = req.body;
        const currentPage = page || 1;
        const perPage = 3;

        const products = await Product.find({})
            .skip((currentPage - 1) * perPage)
            .populate("category")
            .populate("subs")
            .sort([[sort, order]])
            .limit(perPage)
            .exec();

        res.json(products);
    } catch (err) {
        console.log(err);
    }
};

exports.productsCount = async (req, res) => {
    let total = await Product.find({}).estimatedDocumentCount().exec();
    res.json(total);
};

exports.productStar = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec();
    const user = await User.findOne({ email: req.user.email}).exec();
    const { star } = req.body;

    // who is updating?
    // check if currently logged in user have already added rating to this product?
    let existingRatingObject = product.ratings.find(
        //(ele) => ele.postedBy == user._id
        (ele) => ele.postedBy.toString() === user._id.toString()
    );

    // if user haven't rating yet, push it
    if(existingRatingObject === undefined) {
        let ratingAdded = await Product.findByIdAndUpdate(
            product._id,
            {
                $push: { ratings: { star, postedBy: user._id}},
            },
            { new: true }
        ).exec();
        console.log("ratingAdded", ratingAdded);
        res.json(ratingAdded);
    } else {
        // if user have already left rating, update it
        const ratingUpdated = await Product.updateOne(
            {
                ratings: { $elemMatch: existingRatingObject },
            },
            { $set: { "ratings.$.star": star } },
            { new: true }
        ).exec();
        console.log("ratingUpdated", ratingUpdated);
        res.json(ratingUpdated);
    }
};

exports.listRelated = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec();
  
    const related = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
    })
      .limit(3)
      .populate("category")
      .populate("subs")
      .populate("ratings.postedBy")
      .exec();
  
    res.json(related);
  };