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

        // add images 
        const imageUrls = [];
        for (const file of imageFiles) {
            const uploadResult = await cloudinary.uploader.upload(file.path, {
                folder: "products",
            });
            imageUrls.push(uploadResult.secure_url);
        }

        // add points 
        const productFeaturese = JSON.parse(productFeatures.replace(/'/g, '"'))

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
            productFeatures: productFeaturese,
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
        const product = await Product.findById(id).populate('category', 'name');
        if (!product) {
            return res.status(404).json({ message: 'Product is not exist' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch product' });
    }
};

// update product 
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params; // Product ID
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

        console.log(req.body)
        // Validate Product ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: "Invalid product ID." });
        }

        // Find the product
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, error: "Product not found." });
        }

        // Update fields
        if (productName) product.name = productName;
        if (productDescription) product.description = productDescription;
        if (productStock !== undefined) product.inStock = productStock;
        if (productPrice) product.price = productPrice;
        if (discountPrice) product.discountPrice = discountPrice;
        if (productFor) product.productFor = productFor;

        // Update category if changed
        if (categories && mongoose.Types.ObjectId.isValid(categories) && categories !== product.category.toString()) {
            const oldCategory = await Category.findById(product.category);
            if (oldCategory) {
                oldCategory.itemCount -= 1;
                await oldCategory.save();
            }

            const newCategory = await Category.findById(categories);
            if (newCategory) {
                newCategory.itemCount += 1;
                await newCategory.save();
            }

            product.category = categories;
        }

        // Parse and update product features
        if (productFeatures) {
            try {
                product.productFeatures = JSON.parse(productFeatures);
            } catch {
                return res.status(400).json({ success: false, error: "Invalid product features format!" });
            }
        }

        // Handle image updates
        if (req.files && req.files.length > 0) {
            // Upload new images
            const newImageUrls = await Promise.all(
                req.files.map(file => cloudinary.uploader.upload(file.path, { folder: "products" }))
            ).then(results => results.map(result => result.secure_url));

            // Delete old images from Cloudinary
            const oldImagePublicIds = product.imageUrl.map(url => {
                const parts = url.split("/");
                return parts[parts.length - 1].split(".")[0]; // Extract public ID
            });
            await Promise.all(oldImagePublicIds.map(publicId => cloudinary.uploader.destroy(`products/${publicId}`)));

            // Update product with new images
            product.imageUrl = newImageUrls;
        }

        // Save updated product
        await product.save();

        res.status(200).json({ success: true, message: "Product updated successfully", product });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ success: false, error: "Server error while updating product." });
    }
};

// get all products 
exports.getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sortField = req.query.sortField || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const category = req.query.category;
        const search = req.query.searchQuery;

        const query = search ? { name: { $regex: search, $options: 'i' } } : {};

        const skip = (page - 1) * limit;

        // Fetch products and populate category

        let products = await Product.find(query)
            .populate('category', 'name')
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(limit);;

        // Filter by category name in JavaScript
        if (category) {
            products = products.filter((product) =>
                product.category.name.toLowerCase().includes(category.toLowerCase())
            );
        }

        const totalCount = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({
            success: true,
            products,
            totalCount,
            totalPages,
            currentPage: page,
        });
    } catch (error) {
        console.error('Error in getAllProducts:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch products', error: error.message });
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