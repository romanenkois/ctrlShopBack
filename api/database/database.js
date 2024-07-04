const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.CONNECTION_STRING;
const dbName = 'ctrlShop';

let db;

async function connectToDatabase() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoBD');
        db = client.db(dbName);
    } catch (error) {
        console.error('Error conecting to MongoDB\n', error);
        throw error;
    }
}

function getDb() {
    if (!db) {
        throw new Error('DB error');
    }
    return db;
}

module.exports = connectToDatabase;
module.exports.getDb = getDb;
