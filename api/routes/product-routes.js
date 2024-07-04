const express = require('express');
const router = express.Router();

const {
    getProducts,
    getProduct,
    addProduct
} = require('../controllers/product-controller');

router.get('/products/', getProducts);
router.get('/products/:id', getProduct);
router.post('/products/', upload.array('images', 3), addProduct);

module.exports = router;