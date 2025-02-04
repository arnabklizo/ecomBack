const express = require("express");
const { addToWishlist, getWishlist, removeFromWishlist } = require("../controllers/wishlistController");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add", addToWishlist);
router.get("/", protect, getWishlist);
router.delete("/:productId", removeFromWishlist);

module.exports = router;
