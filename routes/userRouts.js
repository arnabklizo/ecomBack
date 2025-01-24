const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const { updateUserDetails, getUserDetails } = require('../controllers/userController');

// Protected route to update the user's address
router.put('/update/:id', updateUserDetails);
router.get("/me", protect, getUserDetails);

module.exports = router;
