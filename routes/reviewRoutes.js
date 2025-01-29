const express = require("express");
const {
    createReview,
    getReviewsByProduct,
    updateReview,
    deleteReview,
    getReviewsByUser,
} = require("../controllers/reviewController");
const protect = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a new review
router.post("/", protect, createReview);

// Get reviews by product ID
router.get("/:productId", getReviewsByProduct);

// Get reviews by product ID
router.get("/user/:userId", getReviewsByUser);

// Update a review by ID
router.put("/:id", updateReview);

// Delete a review by ID
router.delete("/:id", deleteReview);

module.exports = router;
