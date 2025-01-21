const mongoose = require("mongoose");
const { find } = require("./Category");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    inStock: {
        type: Number,
        default: true
    },
    imageUrl: {
        type: [String], // Array to store image URLs
        validate: [(val) => val.length <= 4, "Maximum 4 images are allowed."],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number,
        default: 0
    },
    productFor: {
        type: String,
        enum: ["men", "women", "boy", "girl", "unisex"],
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category", required: true
    },
    productFeatures: {
        type: [String],
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);


