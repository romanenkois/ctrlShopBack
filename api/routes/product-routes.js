const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const {
    getProducts,
    getProductsType,
    getProductTypePagination,
    getProduct,
    addProduct,
    deleteProduct
} = require('../controllers/product-controller');

router.get('/products/', getProducts);
router.get('/products/:type', getProductsType);
router.get('/products/:type/:page', getProductTypePagination);
router.get('/product/:id', getProduct);
router.post('/products/', upload.array('image', 8), async (req, res) => {addProduct(req, res);});
router.delete('/products/:id', deleteProduct);

module.exports = router;