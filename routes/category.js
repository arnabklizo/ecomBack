const express = require("express");
const upload = require('../middlewares/multer')
const { createCategory, getCategories, getCategoryById, delCategoryById, updateCategory } = require("../controllers/categoryController");
const protectAdmin = require('../middlewares/adminMiddleware');
const router = express.Router();

// Multer configuration for file uploads
// const storage = multer.diskStorage({});
// const upload = multer({ storage });

// add category
router.post("/", protectAdmin, upload.single("image"), createCategory);

// Fetch all categories
router.get('/', getCategories);

// Fetch a single category by ID
router.get('/:id', getCategoryById);

// delete a single category by ID
router.delete('/:id', protectAdmin, delCategoryById);

// update a single category by ID
router.put('/:id', upload.single("image"), updateCategory)

module.exports = router;
