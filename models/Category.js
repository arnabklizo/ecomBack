const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    itemCount: {
        type: Number,
        default: 0
    },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
