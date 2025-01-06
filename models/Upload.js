const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const Product = require("../models/Product");

const router = express.Router();

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/uploadImages", upload.array("images", 4), async (req, res) => {
    try {
        const imageUrls = [];

        for (const file of req.files) {
            const result = await cloudinary.uploader.upload_stream(
                {
                    folder: "products", // Optional: Cloudinary folder
                },
                (error, result) => {
                    if (error) {
                        return res.status(500).json({ error: "Image upload failed." });
                    }
                    imageUrls.push(result.secure_url);
                }
            );
            file.stream.pipe(result);
        }

        // Once images are uploaded, send the URLs back
        res.status(200).json({ imageUrls });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error uploading images." });
    }
});

module.exports = router;
