const express = require('express');
const router = express.Router();
const multer = require('multer');
const verifyAuth = require('../middleware/verify_auth');
const ProductController = require('../controllers/products_controller');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter,
});

// Handle incoming GET requests to /products
router.get('/', ProductController.get_all_products);

// Handle incoming POST requests to /products
router.post('/', verifyAuth, upload.single('productImage'), ProductController.create_product);

// Handle incoming GET requests to /products/:productId
router.get('/:productId', ProductController.product_by_id);

// Handle incoming PATCH requests to /products/:productId
router.patch('/:productId', verifyAuth, ProductController.update_product);

// Handle incoming DELETE requests to /products/:productId
router.delete('/:productId', verifyAuth, ProductController.delete_product);

module.exports = router;
