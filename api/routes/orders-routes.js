const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

const {
    getOrders,
    getOrder,
    addOrder,

} = require('../controllers/orders-controller');

router.get('/orders/', getOrders);
router.get('/order/:id', getOrder);
router.post('/order/', upload.none(), async (req, res) => {addOrder(req, res);});

module.exports = router;