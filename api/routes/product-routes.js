const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const {
    getProducts,
    getProduct,
    addProduct,
    deleteProduct
} = require('../controllers/product-controller');

router.get('/products/', getProducts);
router.get('/products/:id', getProduct);
router.post('/products/', upload.array('image', 8), async (req, res) => {addProduct(req, res);});
router.delete('/products/:id', deleteProduct);

module.exports = router;