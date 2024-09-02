const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

const {
    
} = require('../controllers/user-controller');

// router.get('/reviews/', getReviews);
// router.get('/review/:id', getReview);
// router.post('/review/', upload.none(), async (req, res) => {addReview(req, res);});

module.exports = router;