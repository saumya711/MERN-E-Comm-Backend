const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    products: [
        {
            product: {
                type: ObjectId,
                ref: "Product",
            },
            count: Number,
            color: String,
            price: Number,
        },
    ],
    paymentIntent: {},
    orderStatus: {
        type: String,
        default: "Not Processed",
        enum: ["Not Processed", "Processing", "Disptched", "Cancelled", "Completed", "Cash On Delivery"]
    },
    orderBy: { type: ObjectId, ref: "User"}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);