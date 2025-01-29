const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const protect = require('../middlewares/authMiddleware');

// add to cart 
router.post("/add", cartController.addToCart);

//remove from cart
router.post("/remove", cartController.removeFromCart);

//get cart details
router.get("/:userId", cartController.getCart);

//update cart details 
router.put("/update", cartController.updateCart);

// clear cart
router.post("/clear", cartController.clearCart);

module.exports = router;
