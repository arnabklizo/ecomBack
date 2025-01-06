const express = require("express");
const { getAllOrders } = require("../controllers/orderController");
const protectAdmin = require("../middlewares/adminMiddleware");
const router = express.Router();

// Admin-only route to view orders
router.get("/", protectAdmin, getAllOrders);

module.exports = router;
