const express = require("express");
const {
    createReview,
    getReviewsByProduct,
    updateReview,
    deleteReview,
} = require("../controllers/reviewController");

const router = express.Router();

// Create a new review
router.post("/", createReview);

// Get reviews by product ID
router.get("/:productId", getReviewsByProduct);

// Update a review by ID
router.put("/:id", updateReview);

// Delete a review by ID
router.delete("/:id", deleteReview);

module.exports = router;
