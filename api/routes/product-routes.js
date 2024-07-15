const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const {
    getProducts,
    getProductsType,
    getProductTypePagination,
    getProduct,
    getProductsSelection,
    addProduct,
    deleteProduct
} = require('../controllers/product-controller');

router.get('/products/', getProducts);
router.get('/products/:type', getProductsType);
router.get('/products/:type/:page', getProductTypePagination);
router.get('/productsselection/', getProductsSelection);
router.get('/product/:id', getProduct);
router.post('/product/', upload.array('image', 8), async (req, res) => {addProduct(req, res);});
router.delete('/product/:id', deleteProduct);

module.exports = router;