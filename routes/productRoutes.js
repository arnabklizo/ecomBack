const express = require("express");
const multer = require("multer");
const {
    addProduct,
    getAllProducts,
    getProduct,
    delProductById,
    updateProduct,
    getProductsByCategory
} = require("../controllers/productController");

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Temp folder for uploads

//add product
router.post("/addProduct", upload.array("images", 4), addProduct);

// Fetch all products
router.get('/', getAllProducts);

// Fetch a single product by ID
router.get('/:id', getProduct);

// delete a single category by ID
router.delete('/:id', delProductById);

// update a single category by ID
router.put('/:id', upload.array('images'), updateProduct)

// Fetch products by category ID
router.get('/category/:categoryId', getProductsByCategory);
module.exports = router;
