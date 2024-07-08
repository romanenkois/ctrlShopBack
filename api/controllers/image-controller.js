const {ObjectId} = require('mongodb');
const { getDb } = require('../database/database');

const collectionName = 'images';

const handleError = (res, error) => {
    
    console.error('AN ERROR OCCURRED\n', error);
    res.status(500).json({ error });
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
    getImage
}