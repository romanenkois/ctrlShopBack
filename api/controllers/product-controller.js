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

const getProductsType = async (req, res) => {
    try {
        if (req.params.type == 'all') {
            getProducts(req, res);
        } else {
            const result = 
            await getDb()
            .collection(collectionName)
            .find({ category: req.params.type })
            .toArray();
        
            res.status(200).json(result);
        }
        
    } catch(err) {
        handleError(res, err)
    };
}

const getProductTypePagination = async (req, res) => {
    try {
        if (req.params.type == 'all') {
            const result = 
                await getDb()
                .collection(collectionName)
                .find({})
                .skip((req.params.page - 1) * 10)
                .limit(10)
                .toArray();

            const itemsCount =
                await getDb()
                .collection(collectionName)
                .countDocuments({});
            
            res.status(200).json({result, itemsCount});
        } else {
            const result = 
            await getDb()
            .collection(collectionName)
            .find({ category: req.params.type })
            .skip((req.params.page - 1) * 10)
            .limit(10)
            .toArray();
            
            const itemsCount =
                await getDb()
                .collection(collectionName)
                .countDocuments({ category: req.params.type});
            
            res.status(200).json({result, itemsCount});
        }

        
    } catch(err) {
        handleError(res, err)
    };
}

const getProductTypePaginationSorting = async (req, res) => {
    try {
        const itemsPerPage = 50;

        const typeCriteria = {};
        if (req.params.type != 'all') {
            typeCriteria.category = req.params.type;
        }

        const sortDirection = req.params.sorting === 'price-asc' ? 1 : req.params.sorting === 'price-desc' ? -1 : 0;
        const sortCriteria = {};

        if (sortDirection !== 0) {
            const result = await getDb()
                .collection(collectionName)
                .aggregate([
                    { $match: typeCriteria },
                    {
                        $addFields: {
                            priceAsNumber: { $toDouble: "$price" }
                        }
                    },
                    { $sort: { priceAsNumber: sortDirection } },
                    { $skip: (req.params.page - 1) * itemsPerPage },
                    { $limit: itemsPerPage }
                ]).toArray();
            
            const itemsCount = await getDb()
                .collection(collectionName)
                .countDocuments({ category: req.params.type });

            return res.status(200).json({ result, itemsCount });
        }

        if (req.params.sorting === 'name-asc') {
            sortCriteria.name = 1;
        } else if (req.params.sorting === 'name-desc') {
            sortCriteria.name = -1;
        }

        const result = await getDb()
            .collection(collectionName)
            .find(typeCriteria)
            .sort(sortCriteria)
            .skip((req.params.page - 1) * 10)
            .limit(10)
            .toArray();

        const itemsCount = await getDb()
            .collection(collectionName)
            .countDocuments({ category: req.params.type });

        res.status(200).json({ result, itemsCount });

    } catch (err) {
        handleError(res, err);
    }
};


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

const getProductsSelection = async (req, res) => {
    try {
        let result = [];
        for (const key in req.body) {
            let product = req.body[key];
            let id = product.productId;

            const res = 
                await getDb()
                .collection(collectionName)
                .findOne({ _id: new ObjectId(id) });
                
            result.push(res);
        }
        res.status(200).json(result);
    } catch(err) {
        handleError(res, err)
    }
}

const addProduct = async (req, res) => {
    try {
        const db = getDb();

        const imageDocuments = req.files.map(file => ({
            filename: file.originalname,
            contentType: file.mimetype,
            data: file.buffer,
        }));

        const imageIds = await Promise.all(imageDocuments.map(async (imgDoc) => {
            const result =
                await getDb()
                .collection('images')
                .insertOne(imgDoc);

            return result.insertedId;
        }));

        const productDocument = {
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            description: req.body.description,
            // more to be added
            image: imageIds.map(id => `https://ctrl-shop-back.vercel.app/image/${id}`)
        };

        const result =
            await getDb()
            .collection(collectionName)
            .insertOne(productDocument);
        
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

        const product =
            await getDb()
            .collection(collectionName)
            .findOne({ _id: new ObjectId(req.params.id) });

        if (!product) {
            return res.status(404).json({ error: 'product does not exist' });
        }

        const imageIds = product.image.map(imgUrl => new ObjectId(imgUrl.split('/').pop()));

        await getDb()
            .collection('images')
            .deleteMany({ _id: { $in: imageIds } });
        
        await getDb()
            .collection(collectionName)
            .deleteOne({ _id: new ObjectId(req.params.id) });

        res.status(200).json({ message: 'product has been deleted' });
    } catch (error) {
        handleError(res, error);
    }
}    

module.exports = {
    getProducts,
    getProductsType,
    getProductTypePagination,
    getProductTypePaginationSorting,
    getProduct,
    getProductsSelection,
    addProduct,
    deleteProduct
}