const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to User model
            required: true,
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product", // Reference to Product model
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1, // Ensure at least 1 item is ordered
                },
                price: {
                    type: Number,
                    required: true,
                },
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "processed", "shipped", "delivered", "cancelled"],
            default: "pending", // Default to 'pending' when an order is created
        },
        shippingAddress: {
            type: String,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ["credit card", "paypal", "cash on delivery"],
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Pre-save hook to update `updatedAt` before every update
orderSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

// Method to calculate total amount
orderSchema.methods.calculateTotal = function () {
    let total = 0;
    this.products.forEach((item) => {
        total += item.price * item.quantity;
    });
    this.totalAmount = total;
    return this.save();
};

module.exports = mongoose.model("Order", orderSchema);
