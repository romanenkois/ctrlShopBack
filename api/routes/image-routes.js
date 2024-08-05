const express = require('express');
const router = express.Router();

const {
    getImagesId,
    getImage,
} = require('../controllers/image-controller');

router.get('/imagesId', getImagesId)
router.get('/image/:id', getImage);

module.exports = router;