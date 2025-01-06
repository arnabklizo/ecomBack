const express = require("express");
const { loginAdmin, logoutAdmin } = require("../controllers/adminController");
const router = express.Router();

// Admin login route
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);

module.exports = router;
