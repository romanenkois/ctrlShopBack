const {ObjectId} = require('mongodb');
const { getDb } = require('../database/database');

const collectionName = 'products';

const handleError = (res, error) => {
    
    console.error('AN ERROR OCCURRED\n', error);
    res.status(500).json({ error });
}

const getProducts = async (_req, res) => {
    try {
        const result = 
            await getDb()
            .collection(collectionName)
            .find({})
            .toArray();
    
        res.status(200).json(result)

    } catch(err) {
        handleError(res, err)
    };
}

const getProduct = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'wrong id type' });
        }

        const result = 
            await getDb()
            .collection(collectionName)
            .findOne({ _id: new ObjectId(req.params.id) });
        
        if (result) {
            res.status(200).json(result)
        } else {
            res.status(418).json({error: 'object not found'})
        }
    } catch(err) {
        handleError(res, err)
    };
}

const addProduct = async (req, res) => {
    try {
        const db = getDb();
        const collection = db.collection(collectionName);

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
            title: req.body.title,
            description: req.body.description,
            info: req.body.info,
            date: req.body.date,
            link: req.body.link,
            image: imageIds.map(id => `https://ctrl-shop-back.vercel.app/image/${id}`)
        };

        const result = await collection.insertOne(productDocument);
        
        res.status(201).json({ message: 'new product document has been inserted', id: result.insertedId });
    } catch(err) {
        handleError(res, err)
    }
}

module.exports = {
    getProducts,
    getProduct,
    addProduct
}