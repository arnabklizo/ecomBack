const Category = require("../models/Category");
const cloudinary = require('../cloudinary/cloudinary');


exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: "No image file uploaded." });
        }

        // Upload image to Cloudinary
        // const result = await cloudinary.uploader.upload(req.file.path);
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "category",
        });;
        // Save category to database
        const category = new Category({
            name,
            imageUrl: result.secure_url,
        });

        await category.save();

        res.status(201).json({ message: "Category created successfully", category });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Fetch all categories
exports.getCategories = async (req, res) => {
    try {
        // const categories = await Category.find().sort({ createdAt: -1 }); // Sort by latest
        const categories = await Category.find() // Sort by latest
        const count = await Category.countDocuments();
        res.status(200).json({ categories, count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch categories' });
    }
};

// Fetch a single category by ID
exports.getCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch category' });
    }
};

// Delete a single category by ID
exports.delCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the category by ID
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Extract the public_id from the imageUrl
        const imageUrl = category.imageUrl;
        const parts = imageUrl.split('/');
        const folderAndImage = parts.slice(-2).join('/'); // Extract last two parts (folder and file name)
        const publicId = folderAndImage.split('.')[0]; // Remove file extension

        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                console.error('Error deleting image from Cloudinary:', error);
                return res.status(500).json({ message: 'Error deleting image from Cloudinary', error });
            }
            console.log('Cloudinary response:', result);
        });

        // Delete the category from the database
        await category.deleteOne();

        res.status(200).json({ message: 'Category and associated image deleted successfully', id });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};


// update a single category by ID
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, imageUrl } = req.body; // Get the new name and image URL from the request body
    // console.log('name :', name);
    // console.log('imageUrl :', imageUrl);
    // console.log('name', name);

    try {
        // Find the category by its ID
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // If the image has been updated, delete the old image from Cloudinary
        if (imageUrl !== category.imageUrl && category.imageUrl) {
            const oldImageUrl = category.imageUrl;

            // Extract the public_id of the old image from its URL
            const oldImagePublicId = oldImageUrl
                .split('/')
                .pop()
                .split('.')[0];
            await cloudinary.uploader.destroy(oldImagePublicId);

        }

        // Update the category with the new name and image URL
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name, imageUrl },
            { new: true } // Return the updated document
        );
        // console.log('Updated category:', updatedCategory);

        if (!updatedCategory) {
            return res.status(400).json({ message: 'Category update failed' });
        }

        res.status(200).json({
            message: 'Category updated successfully',
            category: updatedCategory,
        });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

