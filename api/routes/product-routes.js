const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const {
    getProducts,
    getProduct,
    addProduct
} = require('../controllers/product-controller');

router.get('/products/', getProducts);
router.get('/products/:id', getProduct);
router.post('/products/', upload.array('images', 5), addProduct);

module.exports = router;