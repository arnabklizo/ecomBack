const User = require('../models/User');

// Update user details by ID
module.exports.updateUserDetails = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, phone, addresses } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user details
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phone) user.phone = phone;

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
