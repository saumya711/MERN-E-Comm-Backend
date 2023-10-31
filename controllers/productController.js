const Product = require("../models/productModel");
const slugify = require("slugify");

exports.createProduct = async (req, res) => {
    try {
        console.log(req.body);
        req.body.slug = slugify(req.body.title);
        const newProduct = await new Product(req.body).save();
        res.json(newProduct);
    } catch (error) {
        console.log(err);
        res.status(400).send("Create Product Failed");
    }
};