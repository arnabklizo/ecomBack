const Review = require("../models/Review");

// Create a review
module.exports.createReview = async (req, res) => {
    try {
        const { productId, userId, review, rating } = req.body;
        const newReview = new Review({
            productId,
            userId,
            review,
            rating,
        });
        await newReview.save();
        res.status(201).json({ message: "Review added successfully.!", review: newReview });
    } catch (error) {
        res.status(500).json({ message: "Error adding review", error: error.message });
    }
};

// Get reviews by product ID
module.exports.getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await Review.find({ productId }).populate("userId", "firstName email",);
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reviews", error: error.message });
    }
};

// Get reviews by user Id ID
module.exports.getReviewsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const reviews = await Review.find({ userId }).populate("productId", "name imageUrl",);
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reviews", error: error.message });
    }
};

// Update a review
module.exports.updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { review, rating } = req.body;
        // console.log('review', review);
        // console.log('rating', rating);
        // console.log('id', id);


        const updatedReview = await Review.findByIdAndUpdate(
            id,
            { review, rating },
            { new: true }
        );

        if (!updatedReview) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.status(200).json({ message: "Review updated successfully.!", review: updatedReview });
    } catch (error) {
        res.status(500).json({ message: "Error updating review", error: error.message });
    }
};

// Delete a review
module.exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedReview = await Review.findByIdAndDelete(id);

        if (!deletedReview) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.status(200).json({ message: "Review deleted successfully.!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting review", error: error.message });
    }
};
