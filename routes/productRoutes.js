const express = require("express");
const { addProduct, getAllProducts } = require("../controllers/productController");
const protectAdmin = require("../middlewares/adminMiddleware");
const router = express.Router();

// Admin-only routes
router.post("/", protectAdmin, addProduct);

// Public route to view all products
router.get("/", getAllProducts);

module.exports = router;
