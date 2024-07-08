const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const {ObjectId} = require('mongodb');
const { getDb } = require('../database/database');


const {
    getProducts,
    getProduct,
    addProduct
} = require('../controllers/product-controller');

router.get('/products/', getProducts);
router.get('/products/:id', getProduct);
router.post('/products/', upload.array('image'), async (req, res) => {
    try {
        const db = getDb();
        const collection = db.collection('products');

        const imageDocuments = req.files.map(file => ({
            filename: file.originalname,
            contentType: file.mimetype,
            data: file.buffer,
        }));

        const imageIds = await Promise.all(imageDocuments.map(async (imgDoc) => {
            const result = await db.collection('images').insertOne(imgDoc);
            return result.insertedId;
        }));

        const productDocument = {
            name: req.body.name,
            image: imageIds.map(id => `http://localhost:3000/image/${id}`)
        };

        const result = await collection.insertOne(productDocument);
        
        res.status(201).json({ message: 'new product document has been inserted', id: result.insertedId });
    } catch(err) {
        console.log(err);
        // handleError(res, err)
    }
}

);

module.exports = router;