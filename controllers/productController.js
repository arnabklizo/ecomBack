const Product = require("../models/Product");

// Add a product (Admin only)
exports.addProduct = async (req, res) => {
    const { name, description, inStock, price, discountPrice, productFor, categories, imageUrls } = req.body;
    if (!imageUrls || imageUrls.length === 0) {
        return res.status(400).json({ message: "At least one image is required." });
    }

    try {
        const product = new Product({
            name,
            description,
            inStock,
            price,
            discountPrice,
            productFor,
            categories,
            imageUrl: imageUrls, // Store the Cloudinary URLs here
        });

        await product.save();
        res.status(201).json({ message: "Product added successfully", product });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get all products (Public access)
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
