const Product = require("../models/Product");
const cloudinary = require("../cloudinary/cloudinary");
const mongoose = require("mongoose");
const Category = require("../models/Category");

//add product
exports.addProduct = async (req, res) => {
    try {
        const {
            productName,
            productDescription,
            productStock,
            productPrice,
            discountPrice,
            productFor,
            categories,
            productFeatures,
        } = req.body;

        // Validate required fields
        if (!productDescription) {
            return res.status(400).json({ success: false, error: "Description should not be empty !" });
        }
        if (productFeatures == "[]") {
            return res.status(400).json({ success: false, error: "Add key point !" });
        }

        // Validate category as ObjectId
        if (!mongoose.Types.ObjectId.isValid(categories)) {
            return res.status(400).json({ success: false, error: "Invalid category ID." });
        }

        // Handle image upload
        const imageFiles = req.files;
        if (imageFiles.length === 0) {
            return res.status(400).json({ success: false, error: "Add minimum one image !" });
        }

        const imageUrls = [];
        for (const file of imageFiles) {
            const uploadResult = await cloudinary.uploader.upload(file.path, {
                folder: "products",
            });
            imageUrls.push(uploadResult.secure_url);
        }

        // Create product
        const product = new Product({
            name: productName,
            description: productDescription,
            inStock: productStock || 0,
            price: productPrice,
            discountPrice,
            productFor,
            category: categories,
            imageUrl: imageUrls,
            productFeatures: productFeatures || "[]",
        });

        const category = await Category.findById(categories)
        category.itemCount += 1;
        await category.save();

        await product.save();
        res.status(201).json({ success: true, message: "Product Added successfully", product });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ success: false, error: "Server error while adding product." });
    }
};


// get single product 
exports.getProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product is not exist' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch product' });
    }
};

// get all products 
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch products' });
    }
};

// delete product
exports.delProductById = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the category by ID
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        for (const imageUrl of product.imageUrl) {
            const parts = imageUrl.split('/');
            const publicId = parts.slice(-2).join('/').split('.')[0]; // Extract the public_id from URL
            await cloudinary.uploader.destroy(publicId); // Delete the image from Cloudinary
        }

        const category = await Category.findById(product.category)
        category.itemCount -= 1;
        await category.save();

        // Delete the category from the database
        await product.deleteOne();

        res.status(200).json({ message: 'Product and associated image deleted successfully', id });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};