const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require("dotenv");
dotenv.config();

// Set up Cloudinary credentials using environment variables
cloudinary.config({

    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});
// cloudinary.api.ping()
//     .then((result) => {
//         console.log('Cloudinary ping successful:', result);
//     })
//     .catch((error) => {
//         console.error('Cloudinary connection error:', error);
//     });

// const storage = new CloudinaryStorage({
//     cloudinary,
//     params: {
//         folder: 'ecommerce',  // Define the folder where images will be stored
//         allowedFormats: ['jpeg', 'png', 'jpg'],  // Allowed image formats
//     },
// });



module.exports = cloudinary;
