const express = require('express');
const router = express.Router();
const multer = require("multer");
const protect = require('../middlewares/authMiddleware');
const { updateUserDetails, getUserDetails } = require('../controllers/userController');


// Multer configuration for file uploads
const storage = multer.diskStorage({});
const upload = multer({ dest: 'uploads/' }); // Example for multer


// Protected route to update the user's address
router.put('/update/:id', upload.single('profilePicture'), updateUserDetails);
router.get("/me", protect, getUserDetails);

module.exports = router;
