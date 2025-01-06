const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary"); // Corrected import
const cloudinary = require("../cloudinary/cloudinary"); // Import cloudinary instance

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'ecommerce',
        allowedFormats: ['jpeg', 'png', 'jpg'],
    },
});


// Set up multer with the Cloudinary storage
const upload = multer({ storage });

module.exports = upload;
