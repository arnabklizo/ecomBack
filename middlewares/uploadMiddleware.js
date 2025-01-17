// const multer = require('multer');

// const storage = multer.memoryStorage(); // Store files in memory for processing
// const upload = multer({ storage });

// module.exports = upload;



const multer = require('multer');
const path = require('path');

// Configure Multer
const storage = multer.diskStorage({});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const uploadProduct = multer({ storage, fileFilter });
module.exports = uploadProduct;
