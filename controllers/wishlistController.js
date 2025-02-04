const Wishlist = require("../models/Wishlist");

// Add product to wishlist
module.exports.addToWishlist = async (req, res) => {
    try {
        const { productId, userId } = req.body;

        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            wishlist = new Wishlist({ user: userId, products: [] });
        }

        if (!wishlist.products.includes(productId)) {
            wishlist.products.push(productId);
            await wishlist.save();
            return res.status(200).json({ message: "Product added to wishlist", wishlist });
        } else {
            return res.status(400).json({ message: "Product already in wishlist" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user's wishlist
module.exports.getWishlist = async (req, res) => {
    const { userId } = req.body;
    try {
        const wishlist = await Wishlist.findOne({ userId: userId }).populate('products');
        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Remove product from wishlist
module.exports.removeFromWishlist = async (req, res) => {
    try {
        const { productId, userId } = req.params;
        // const userId = req.user.id;

        let wishlist = await Wishlist.findOne({ user: userId });

        if (wishlist) {
            wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
            await wishlist.save();
            return res.status(200).json({ message: "Product removed from wishlist", wishlist });
        }

        res.status(400).json({ message: "Wishlist not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

