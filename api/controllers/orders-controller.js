const { ObjectId } = require('mongodb');
const { getDb } = require('../database/database');

const collectionName = 'orders';

const handleError = (res, error) => {
    console.error('AN ERROR OCCURRED\n', error);
    res.status(500).json({ error });
}

const getOrders = async (_req, res) => {
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

const getOrder = async (req, res) => {
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

const addOrder = async (req, res) => {
    try {
        const db = getDb();

        const orderDocument = {
            date: req.body.date,
            userId: req.body.userId,
            checkStatus: 'pending',
            orderData: JSON.parse(req.body.orderData),
            customerData: JSON.parse(req.body.ordererData),
        };

        const result =
            await getDb()
            .collection(collectionName)
            .insertOne(orderDocument);
        
        res.status(201).json({ message: 'new product has been added', id: result.insertedId });
    } catch(err) {
        handleError(res, err)
    }
}

module.exports = {
    getOrders,
    getOrder,
    addOrder,
}