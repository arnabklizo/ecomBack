const express = require("express");
// const { verifyToken } = require("../middlewares/authMiddleware")
const { registerUser, loginUser, logoutUser, isAuthenticated } = require("../controllers/authController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/isAuthenticated", isAuthenticated);

module.exports = router;
