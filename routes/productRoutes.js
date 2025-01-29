const express = require("express");
const upload = require('../middlewares/multer');
const protectAdmin = require('../middlewares/adminMiddleware');
const {
    addProduct,
    getAllProducts,
    getProduct,
    delProductById,
    updateProduct,
    getProductsByCategory
} = require("../controllers/productController");

const router = express.Router();
// const upload = multer({ dest: "uploads/" }); // Temp folder for uploads

//add product
router.post("/addProduct", protectAdmin, upload.array("images", 4), addProduct);

// Fetch all products
router.get('/', getAllProducts);

// Fetch a single product by ID
router.get('/:id', getProduct);

// delete a single category by ID
router.delete('/:id', protectAdmin, delProductById);

// update a single category by ID
router.put('/:id', protectAdmin, upload.array('images'), updateProduct)

// Fetch products by category ID
router.get('/category/:categoryId', getProductsByCategory);


module.exports = router;
