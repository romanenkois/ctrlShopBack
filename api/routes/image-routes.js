const express = require('express');
const router = express.Router();

const {
    getImage
} = require('../controllers/image-controller');

router.get('/image/:id', getImage);

module.exports = router;