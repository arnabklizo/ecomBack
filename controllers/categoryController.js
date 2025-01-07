const Category = require("../models/Category");
const cloudinary = require('../cloudinary/cloudinary');


exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: "No image file uploaded." });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

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
        const count = await Category.countDocuments(); // Count the total categories
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
        const publicId = imageUrl.split('/').pop().split('.')[0];

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
    const { name, imageUrl } = req.body; // Include other fields you want to update
    console.log('id:', id)
    console.log('imageUrl:', imageUrl)
    console.log('name:', name)
    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name, imageUrl }, // Include other fields to update
            { new: true } // Return the updated document
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

// exports.updateCategory = async (req, res) => {
//     const { id } = req.params;
//     const { name, imageUrl } = req.body; // Get the new name and image URL from the request body

//     try {
//         // Find the category by its ID
//         const category = await Category.findById(id);
//         if (!category) {
//             return res.status(404).json({ message: 'Category not found' });
//         }

//         // If image is updated, delete the old image from Cloudinary
//         if (imageUrl !== category.imageUrl && category.imageUrl) {
//             // Extract the public_id of the old image URL (Cloudinary stores the public_id in the URL)
//             const oldImagePublicId = category.imageUrl.split('/').pop().split('.')[0];

//             // Delete the old image from Cloudinary
//             await cloudinary.uploader.destroy(oldImagePublicId, function(result) {
//                 if (result.result !== 'ok') {
//                     console.log('Failed to delete the old image:', result);
//                 }
//             });
//         }

//         // Update the category with the new name and image URL
//         const updatedCategory = await Category.findByIdAndUpdate(
//             id,
//             { name, imageUrl }, // Update both the name and image URL
//             { new: true } // Return the updated document
//         );

//         if (!updatedCategory) {
//             return res.status(404).json({ message: 'Category update failed' });
//         }

//         // Return a success response
//         res.status(200).json({
//             message: 'Category updated successfully',
//             category: updatedCategory
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error', error });
//     }
// };

