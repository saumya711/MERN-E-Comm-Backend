const Product = require("../models/productModel");
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

exports.getAllProducts = async (req, res) => {
    let products = await Product.find({});
    res.json(products);
}