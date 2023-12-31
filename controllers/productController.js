const Product = require("../models/productModel");
const User = require("../models/userModel");
const slugify = require("slugify");

exports.createProduct = async (req, res) => {
    try {
        // console.log(req.body);
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
      .exec();
  
    res.json(related);
  };


// SEARCH / FILTER

exports.searchFilters = async (req, res) => {
    const { searchQuery, price, category, stars, sub, shipping, brand, color } = req.body;

    if (searchQuery) {
        console.log("searchQuery ---->", searchQuery);
        await handleQuery(req, res, searchQuery);
    }

    // price [20, 200]
    if (price !== undefined) {
        console.log("price ---->", price);
        await handlePrice(req,res, price);
    }

    // category
    if (category) {
        console.log("category ---->", category);
        await handleCategory(req,res, category);
    }

    // ratings
    if (stars) {
        console.log("stars ---->", stars);
        await handleRating(req,res, stars);
    }

    // Sub-categories
    if (sub) {
        console.log("subs ---->", sub);
        await handleSubCategory(req,res, sub);
    }

    // Shipping
    if (shipping) {
        console.log("shipping ---->", shipping);
        await handleShipping(req,res, shipping);
    }

    // Brand
    if (brand) {
        console.log("brand ---->", brand);
        await handleBrand(req,res, brand);
    }

    // Color
    if (color) {
        console.log("color ---->", color);
        await handleColor(req,res, color);
    }
}

const handleQuery = async (req, res, searchQuery) => {
    const products = await Product.find({ $text: { $search: searchQuery}})
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .exec();

    res.json(products);
}

const handlePrice = async (req, res, price) => {
    try {
        let products = await Product.find({
            price: {
                $gte: price[0],
                $lte: price[1],
            },
        })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .exec();

        res.json(products);
    } catch (err) {
        console.log(err);
    }
}

const handleCategory = async (req, res, category) => {
    try {
        let products = await Product.find({ category })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .exec();

        res.json(products);
    } catch (err) {
        console.log(err);
    }
}

// const handleRating = async (req, res, stars) => {
//     Product.aggregate([
//     {
//       $project: {
//         document: "$$ROOT",
//         // title: "$title",
//         floorAverage: {
//           $floor: { $avg: "$ratings.star"}, // 3.33      
//         },
//       },
//     },
//       { $match: {floorAverage: stars} }
//     ])
//     .limit(12)
//     .exec((err, aggregates) => {
//       if (err) console.log("AGGREGATE ERROR", err);
//       Product.find({ _id: aggregates})
//       .populate('category', '_id name')
//       .populate('subs', '_id name')
//       .exec((err, products) => {
//         if (err) console.log("PRODUCT AGGREGATE ERROR", err);
//         res.json(products);
//       });
//     })
// }

const handleRating = async (req, res, stars) => {
    try {
        const aggregates = await Product.aggregate([
            {
                $project: {
                    document: "$$ROOT",
                    floorAverage: {
                        $floor: { $avg: "$ratings.star" },
                    },
                },
            },
            { $match: { floorAverage: stars } },
        ]).limit(12);

        const productIds = aggregates.map((agg) => agg._id);

        const products = await Product.find({ _id: { $in: productIds } })
            .populate('category', '_id name')
            .populate('subs', '_id name');

        res.json(products);
    } catch (err) {
        console.log("Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const handleSubCategory = async (req, res, sub) => {
    try {
        let products = await Product.find({ subs: sub })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .exec();

        res.json(products);
    } catch (err) {
        console.log(err);
    }
}

const handleBrand = async (req, res, brand) => {
    try {
        let products = await Product.find({ brand })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .exec();

        res.json(products);
    } catch (err) {
        console.log(err);
    }
}

const handleColor = async (req, res, color) => {
    try {
        let products = await Product.find({ color })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .exec();

        res.json(products);
    } catch (err) {
        console.log(err);
    }
}

const handleShipping = async (req, res, shipping) => {
    try {
        let products = await Product.find({ shipping })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .exec();

        res.json(products);
    } catch (err) {
        console.log(err);
    }
}