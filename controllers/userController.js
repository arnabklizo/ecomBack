const User = require('../models/User');
const cloudinary = require('../cloudinary/cloudinary');
const fs = require('fs/promises');

// Update user details by ID
module.exports.updateUserDetails = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, phone, addresses } = req.body.profile;  // Assuming you send an array of address IDs to delete
    // const profilePicture = req.body.profilePicture;
    const deleteAddresses = req.body.deleteAddresses; // Parse delete addresses
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (req.file) {
            try {
                if (user.imageUrl) {
                    const oldImageUrl = user.imageUrl;
                    const oldImagePublicId = oldImageUrl
                        .split('/')
                        .pop()
                        .split('.')[0];
                    const result = await cloudinary.uploader.destroy(`profile_pictures/${oldImagePublicId}`);
                }

                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: "profile_pictures",
                });
                user.imageUrl = result.secure_url;
                await fs.unlink(req.file.path); // Clean up the temporary file
            } catch (uploadError) {
                return res.status(500).json({ message: "Error uploading profile picture", error: uploadError.message });
            }
        }


        // Update user details
        if (firstName) user.firstName = firstName.trim();
        if (lastName) user.lastName = lastName.trim();
        if (phone) user.phone = phone.trim();


        // Update or add addresses
        if (addresses) {
            addresses.forEach((newAddress) => {
                const existingAddress = user.addresses.find(
                    (addr) => addr._id?.toString() === newAddress.id
                );
                if (existingAddress) {
                    // Update existing address
                    Object.assign(existingAddress, newAddress);
                } else {
                    // Add new address
                    user.addresses.push(newAddress);
                }
            });
        }

        // Delete specified addresses
        if (deleteAddresses && Array.isArray(deleteAddresses)) {
            user.addresses = user.addresses.filter(
                (address) => !deleteAddresses.includes(address._id.toString())
            );
        }


        await user.save();
        res.status(200).json({ message: "User details updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error updating user details", error: error.message });
    }
};



module.exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
