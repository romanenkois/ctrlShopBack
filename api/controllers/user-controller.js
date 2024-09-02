const { ObjectId } = require('mongodb');
const { getDb } = require('../database/database');

const collectionName = 'users';

const handleError = (res, error) => {
    console.error('AN ERROR OCCURRED\n', error);
    res.status(500).json({ error });
}

// const getReview = async (req, res) => {
//     try {
//         if (!ObjectId.isValid(req.params.id)) {
//             return res.status(400).json({ error: 'wrong id type' });
//         }

//         const result = 
//             await getDb()
//             .collection(collectionName)
//             .findOne({ _id: new ObjectId(req.params.id) });
        
//         if (result) {
//             res.status(200).json(result)
//         } else {
//             res.status(418).json({error: 'object not found'})
//         }
//     } catch(err) {
//         handleError(res, err)
//     };
// }

// const getReviews = async (_req, res) => {
//     try {
//         const result = 
//             await getDb()
//             .collection(collectionName)
//             .find({ checkStatus: 'confirmed' })
//             .toArray();
    
//         res.status(200).json(result)

//     } catch(err) {
//         handleError(res, err)
//     };
// }

// const getAllReviews = async (_req, res) => {
//     try {
//         const result = 
//             await getDb()
//             .collection(collectionName)
//             .find({})
//             .toArray();
    
//         res.status(200).json(result)

//     } catch(err) {
//         handleError(res, err)
//     };
// }

// const getProductReview = async (req, res) => {
//     try {
//         if (req.params.id == 'all') {
//             getReviews(req, res);
//         } else {
//             const result = 
//             await getDb()
//             .collection(collectionName)
//             .find({ productId : req.params.id, checkStatus: 'confirmed' })
//             .toArray();
        
//             res.status(200).json(result);
//         }
        
//     } catch(err) {
//         handleError(res, err)
//     };
// }

// const addReview = async (req, res) => {
//     try {
//         const insertDocument = {
//             date: req.body.date,
//             userId: req.body.userId,
//             productId: req.body.productId,
//             reviewText: req.body.reviewText,
//             reviewRating: req.body.reviewRating,
//             // checkStatus: 'pending',
//             checkStatus:'confirmed',
//         };

//         const result =
//             await getDb()
//             .collection(collectionName)
//             .insertOne(insertDocument);
        
//         res.status(201).json({ message: `new document has been added to ${collectionName}`, id: result.insertedId });
//     } catch(err) {
//         handleError(res, err)
//     }
// }

module.exports = {
    
}