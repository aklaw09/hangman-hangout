const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'hangman';

let db;

async function connectToDB () {
    if (!db) {
        try {
            await client.connect();
            console.log("Connected to MongoDB");
            db = client.db(dbName);
        } catch (error) {
            console.error("Failed to connect to MongoDB:", error);
            process.exit(1);
        }
    }
    return db;

}

async function getDB() {
    if(!db) {
        return await connectToDB();
    } else {
        return db;
    }
}


module.exports = {
    connectToDB,
    getDB
};