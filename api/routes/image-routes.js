const express = require('express');
const router = express.Router();

const {
    getImagesId,
    getImage,
} = require('../controllers/image-controller');

router.get('/imagesId', getImagesId)
router.get('/image/:id', getImage);
router.get('/defaultPicture/',  async (req, res) => {getImage(req, res)});

module.exports = router;