const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

async function createGame (document, collection) {
    try {
        const db = await getDB();
        const games = db.collection(collection);
        const res = await games.insertOne(document);
        return res.insertedId.toString();
    } catch (error) {
        throw new Error(error)
    }
}

async function findGameUsingID (id, collection) {
    try {
        const db = await getDB();
        const games = db.collection(collection);
        const objId = ObjectId.createFromHexString(id)
        const game = (await games.find({"_id": objId}).toArray())[0];
        return game;
    } catch (error) {
        throw new Error(error)
    }
}

async function updateGame (document, collection) {
    try {
        const db = await getDB();
        const games = db.collection(collection);
        const id = document["_id"];
        delete document["_id"]
        const res = await games.updateOne({"_id": id} , { $set : document});
    } catch (error) {
        throw new Error(error)
    }
}

async function getAllActiveGames (collection) {
    try {
        const db = await getDB();
        const games = db.collection(collection);
        return (await games.find({status: "running"}).toArray());
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    createGame,
    findGameUsingID,
    updateGame,
    getAllActiveGames
}