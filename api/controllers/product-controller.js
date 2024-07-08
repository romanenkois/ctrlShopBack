const { ObjectId } = require('mongodb');
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
            price: req.body.price,
            description: req.body.description,
            // more to be added
            image: imageIds.map(id => `https://ctrl-shop-back.vercel.app/image/${id}`)
        };

        const result = await collection.insertOne(productDocument);
        
        res.status(201).json({ message: 'new product has been added', id: result.insertedId });
    } catch(err) {
        handleError(res, err)
    }
}

const deleteProduct = async(req, res) => {
    try {
        const db = getDb();

        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'wrong id type' });
        }

        const productId = req.params.id;
        console.log('productId: ', productId);
        const product = await db.collection('products').findOne({ _id: new ObjectId(productId) });
        console.log('product: ', product);

        if (!product) {
            return res.status(404).json({ error: 'product does not exist' });
        }

        const imageIds = product.image.map(imgUrl => new ObjectId(imgUrl.split('/').pop()));
        await db.collection('images').deleteMany({ _id: { $in: imageIds } });

        await db.collection('products').deleteOne({ _id: new ObjectId(productId) });

        res.status(200).json({ message: 'product has been deleted' });
    } catch (error) {
        handleError(res, error);
    }
}    

module.exports = {
    getProducts,
    getProduct,
    addProduct,
    deleteProduct
}