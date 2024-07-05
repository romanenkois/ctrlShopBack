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
            res.status(400).json({error: 'object not found'})
        }
    } catch(err) {
        handleError(res, err)
    };
}

const addProduct = async (req, res) => {
    try {
        res.status(201).json({ message: 'Product added' });
    } catch(err) {
        handleError(res, err)
    }
}

module.exports = {
    getProducts,
    getProduct,
    addProduct
}