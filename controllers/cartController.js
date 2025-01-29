const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Add item to cart
module.exports.addToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ userId });

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const existingItem = cart.items.find((item) => item.productId.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        // Calculate total price
        cart.totalPrice = await calculateTotal(cart.items);
        cart.discount = await discountPrice(cart.items);

        await cart.save();
        res.status(200).json({ message: "Item added to cart", cart });
    } catch (error) {
        res.status(500).json({ message: "Error adding to cart", error: error.message });
    }
};

// Remove item from cart
module.exports.removeFromCart = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
        cart.totalPrice = await calculateTotal(cart.items);
        cart.discount = await discountPrice(cart.items);


        await cart.save();
        res.status(200).json({ message: "Item removed from cart", cart });
    } catch (error) {
        res.status(500).json({ message: "Error removing item", error: error.message });
    }
};

// Get user cart
module.exports.getCart = async (req, res) => {
    const { userId } = req.params;

    try {
        const cart = await Cart.findOne({ userId }).populate("items.productId");
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        res.status(200).json({ cart });
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart", error: error.message });
    }
};

// Update item quantity
module.exports.updateCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const item = cart.items.find((item) => item.productId.toString() === productId);
        if (!item) return res.status(404).json({ message: "Item not found in cart" });

        item.quantity = quantity;
        cart.totalPrice = await calculateTotal(cart.items);
        cart.discount = await discountPrice(cart.items);


        await cart.save();
        res.status(200).json({ message: "Cart updated", cart });
    } catch (error) {
        res.status(500).json({ message: "Error updating cart", error: error.message });
    }
};

// Clear cart
module.exports.clearCart = async (req, res) => {
    const { userId } = req.body;

    try {
        await Cart.findOneAndDelete({ userId });
        res.status(200).json({ message: "Cart cleared successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error clearing cart", error: error.message });
    }
};

// Helper function to calculate total price
const calculateTotal = async (items) => {
    let total = 0;
    for (let item of items) {
        const product = await Product.findById(item.productId);
        if (product) {
            total += product.price * item.quantity;
        }
    }
    return total;
};

const discountPrice = async (items) => {
    let total = 0;
    for (let item of items) {
        const product = await Product.findById(item.productId);
        if (product) {
            total += product.discountPrice * item.quantity;
        }
    }
    return total;
}
