const express = require("express");
const { loginAdmin, logoutAdmin, isAuthenticated } = require("../controllers/adminController");
const router = express.Router();

// Admin login route
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.get("/isAuthenticated", isAuthenticated);

module.exports = router;
