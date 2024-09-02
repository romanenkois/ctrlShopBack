const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

const {
    getReview,
    getReviews,
    getAllReviews,
    getProductReview,
    addReview,

} = require('../controllers/review-controller');

router.get('/review/:id', getReview);
router.get('/reviews/', getReviews);
router.get('/reviewsAll/', getAllReviews);
router.get('/reviews/:id', getProductReview);
router.post('/review/', upload.none(), async (req, res) => {addReview(req, res);});

module.exports = router;