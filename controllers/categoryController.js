const Category = require("../models/Category");
const cloudinary = require('../cloudinary/cloudinary');
const fs = require('fs/promises');

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: "No image file uploaded." });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "category",
        });

        // Delete the temporary file
        await fs.unlink(req.file.path);

        // Save category to database
        const category = new Category({
            name,
            imageUrl: result.secure_url,
        });

        await category.save();

        res.status(201).json({ message: "Category created successfully !", category });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Fetch all categories
exports.getCategories = async (req, res) => {
    try {

        // Get page and limit from query parameters, with default values
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const sortField = req.query.sortField;
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const search = req.query.searchQuery;


        const query = search ? { name: { $regex: search, $options: 'i' } } : {};

        // Calculate the starting index for the query
        const skip = (page - 1) * limit;

        const categories = await Category.find(query)
            .sort({ [sortField]: sortOrder }) // Sort
            .skip(skip)
            .limit(limit);

        const totalCount = await Category.countDocuments(query);

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({
            categories,
            totalCount,
            totalPages,
            currentPage: page,
        });

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
        await cloudinary.uploader.destroy(`${publicId}`, (error, result) => {
            if (error) {
                console.error('Error deleting image from Cloudinary:', error);
                return res.status(500).json({ message: 'Error deleting image from Cloudinary', error });
            }
            // console.log('Cloudinary response:', result);
        });

        // Delete the category from the database
        await category.deleteOne();

        res.status(200).json({ message: 'Category deleted successfully !', id });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};


// update a single category by ID
// exports.updateCategory = async (req, res) => {
//     const { id } = req.params;
//     const { name } = req.body; // Updated category name
//     try {
//         const category = await Category.findById(id);
//         if (!category) {
//             return res.status(404).json({ message: "Category not found" });
//         }

//         // If an image file is uploaded, update it
//         if (req.file) {

//             try {
//                 // Delete old image from Cloudinary
//                 if (category.imageUrl) {
//                     console.log('category.imageUrl', category.imageUrl)
//                     const oldImagePublicId = category.imageUrl.split("/").pop().split(".")[0];
//                     await cloudinary.uploader.destroy(`category/${oldImagePublicId}`);
//                 }

//                 // Upload new image
//                 const result = await cloudinary.uploader.upload(req.file.path, {
//                     folder: "category",
//                 });
//                 category.imageUrl = result.secure_url

//                 // Remove temp file
//                 await fs.promises.unlink(req.file.path);
//             } catch (error) {
//                 return res.status(500).json({ message: "Error uploading image", error: error.message });
//             }
//         }

//         // Update category name if provided
//         if (name) {
//             category.name = name.trim();
//         }

//         await category.save();
//         res.status(200).json({ message: "Category updated successfully !", category });
//     } catch (error) {
//         res.status(500).json({ message: "Error updating category", error: error.message });
//     }
// };



module.exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // If a new image is uploaded
        if (req.file) {
            try {
                // Extract public ID from Cloudinary URL
                if (category.imageUrl) {
                    const oldImagePublicId = category.imageUrl.split('/').slice(-1)[0].split('.')[0];
                    await cloudinary.uploader.destroy(`category/${oldImagePublicId}`);
                }

                // Upload new image
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: "category",
                });


                category.imageUrl = result.secure_url;
                await fs.unlink(req.file.path);
            } catch (error) {
                return res.status(500).json({ message: "Error uploading image", error: error.message });
            }
        }

        // Update category name if provided
        if (name) {
            category.name = name.trim();
        }

        await category.save();
        res.status(200).json({ message: "Category updated successfully", category });
    } catch (error) {
        res.status(500).json({ message: "Error updating category", error: error.message });
    }
};

