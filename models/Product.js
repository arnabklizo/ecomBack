const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    inStock: {
        type: Boolean,
        default: true,
    },
    imageUrl: {
        type: [String], // Array to store image URLs
        validate: [(val) => val.length <= 4, "Maximum 4 images are allowed."], // Validate maximum 4 images
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discountPrice: {
        type: Number,
        default: 0,
    },
    productFor: {
        type: String,
        enum: ["men", "women", "boy", "girl", "unisex"],
        required: true,
    },
    categories: {
        type: [String], // Array to store categories (can be like ["electronics", "clothing"])
        required: true,
    },
});

// Pre-save hook to update `updatedAt` before every update
productSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

// Method to update stock
productSchema.methods.updateStock = function (quantity) {
    this.stock -= quantity;
    return this.save();
};

module.exports = mongoose.model("Product", productSchema);
