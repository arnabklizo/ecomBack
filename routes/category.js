const express = require("express");
const multer = require("multer");
const path = require("path");
const { createCategory, getCategories, getCategoryById, delCategoryById, updateCategory } = require("../controllers/categoryController");

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post("/", upload.single("image"), createCategory);

// Fetch all categories
router.get('/', getCategories);

// Fetch a single category by ID
router.get('/:id', getCategoryById);

// delete a single category by ID
router.delete('/:id', delCategoryById);

// update a single category by ID
router.put('/:id', updateCategory)

module.exports = router;
