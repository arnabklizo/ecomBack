const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const protect = require('../middlewares/authMiddleware');

// add to cart 
router.post("/add", protect, cartController.addToCart);

//remove from cart
router.post("/remove", protect, cartController.removeFromCart);

//get cart details
router.get("/:userId", protect, cartController.getCart);

//update cart details 
router.put("/update", protect, cartController.updateCart);

// clear cart
router.post("/clear", protect, cartController.clearCart);

module.exports = router;
