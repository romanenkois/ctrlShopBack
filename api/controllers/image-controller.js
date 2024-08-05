const {ObjectId} = require('mongodb');
const { getDb } = require('../database/database');

const collectionName = 'images';

const handleError = (res, error) => {
    
    console.error('AN ERROR OCCURRED\n', error);
    res.status(500).json({ error });
}

const getImagesId = async (req, res) => {
    try {
        const db = getDb();
        const collection = db.collection(collectionName);
        
        // Find documents but only project the _id field
        const images = await collection.find({}, { projection: { _id: 1 } }).toArray();

        // Map the results to an array of _id values
        const imageIds = images.map(image => image._id);

        res.json(imageIds);

    } catch(err) {
        handleError(res, err)
    };
}

const getImage = async (req, res) => {
    try {
        const db = getDb();
        const collection = db.collection(collectionName);
        const image = await collection.findOne({ _id: new ObjectId(req.params.id) });

        if (!image) {
            return res.status(404).json({ error: 'Зображення не знайдено' });
        }

        res.set('Content-Type', image.contentType);
        res.send(image.data.buffer);

    } catch(err) {
        handleError(res, err)
    };
}

module.exports = {
    getImagesId,
    getImage
}