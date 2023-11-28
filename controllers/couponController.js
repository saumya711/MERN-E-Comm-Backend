const Coupon = require("../models/couponModel");

exports.createCoupon = async (req, res) => {
    try {
        const { name, expiry, discount } = req.body.coupon;
        const coupon = await new Coupon({ name, expiry, discount }).save();
        res.json(coupon);
    } catch (err) {
        console.log(err)
    }
}

exports.getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({}).sort({createdAt: -1}).exec();
        res.json(coupons);
    } catch (err) {
      console.log(err)
    }  
}

exports.deleteCoupon = async (req, res) => {
    try {
        const deleted = await Coupon.findByIdAndDelete(req.params.couponId).exec();
        res.json(deleted);
    } catch (err) {
      console.log(err)
    }
}