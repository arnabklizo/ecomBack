const express = require("express");
const multer = require("multer");
const path = require("path");
const { createCategory } = require("../controllers/categoryController");

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post("/", upload.single("image"), createCategory);

module.exports = router;
