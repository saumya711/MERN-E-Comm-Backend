const Category = require("../models/categoryModel");
const SubCategory = require("../models/subCategoryModel");
const slugify = require("slugify");

exports.create = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await new Category({ name, slug: slugify(name) }).save();
        res.json(category);
    } catch (error) {
        res.status(400).send("Create category failed");
    }
};

exports.getAllCategories = async (req, res) => {
    const Categories = await Category.find({}).sort({createdAt: -1}).exec();
    res.json(Categories);
};

exports.GetCategory = async(req, res) => {
    let category = await Category.findOne({ slug: req.params.slug}).exec();
    res.json(category);
};

exports.updateCategory = async(req, res) => {
    const { name, parent } = req.body;
    try {
        const updated = await Category.findOneAndUpdate(
            {slug: req.params.slug}, 
            {name, parent, slug: slugify(name)},
            { new: true}
        )
        res.json(updated);
    } catch (error) {
        res.status(400).send("Update category failed");
    }
};

exports.deleteCategory = async(req, res) => {
    try {
        const deleted = await Category.findOneAndDelete({ slug: req.params.slug});
        res.json(deleted);
    } catch (error) {
        res.status(400).send("Delete category failed");
    }
};

// exports.getSubCategories = (req, res) => {
//     SubCategory.find({ parent: req.params._id}).exec((err, subs) => {
//         if(err) console.log(err);
//         res.json(subs);
//     })
// }

exports.getSubCategories = async (req, res) => {
    const parentId = req.params._id;
    
    if (!parentId) {
      return res.status(400).json({ error: "Invalid input" });
    }
  
    try {
      const subs = await SubCategory.find({ parent: parentId }).exec();
      
      if (!subs) {
        return res.status(404).json({ error: "Parent category not found" });
      }
      res.status(200).json(subs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  