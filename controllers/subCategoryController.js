const SubCategory = require("../models/subCategoryModel");
const slugify = require("slugify");

exports.createSubCategory = async (req, res) => {
    try {
        const { name, parent } = req.body;
        const subCategory = await new SubCategory({ name, parent, slug: slugify(name) }).save();
        res.json(subCategory);
    } catch (error) {
        res.status(400).send("Create sub-category failed");
    }
};

exports.getAllSubCategories = async (req, res) => {
    const SubCategories = await SubCategory.find({}).sort({createdAt: -1}).exec();
    res.json(SubCategories);
};

exports.GetSubCategory = async(req, res) => {
    let SubCategory = await SubCategory.findOne({ slug: req.params.slug}).exec();
    res.json(SubCategory);
};

exports.updateSubCategory = async(req, res) => {
    const { name } = req.body;
    try {
        const updated = await SubCategory.findOneAndUpdate(
            {slug: req.params.slug}, 
            {name, slug: slugify(name)},
            { new: true}
        )
        res.json(updated);
    } catch (error) {
        res.status(400).send("Update sub-category failed");
    }
};

exports.deleteSubCategory = async(req, res) => {
    try {
        const deleted = await SubCategory.findOneAndDelete({ slug: req.params.slug});
        res.json(deleted);
    } catch (error) {
        res.status(400).send("Delete sub-category failed");
    }
};