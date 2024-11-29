const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

async function createGame (document) {
    try {
        const db = await getDB();
        const games = db.collection("games");
        const res = await games.insertOne(document);
    } catch (error) {
        throw new Error(error)
    }
}

async function findGameUsingID (id) {
    try {
        const db = await getDB();
        const games = db.collection("games");
        const objId = ObjectId.createFromHexString(id)
        const game = (await games.find({"_id": objId}).toArray())[0];
        return game;
    } catch (error) {
        throw new Error(error)
    }
}

async function updateGame (document) {
    try {
        const db = await getDB();
        const games = db.collection("games");
        await games.updateOne({id: document.id} , { $set : document});
    } catch (error) {
        throw new Error(error)
    }
}

async function getAllActiveGames (document) {
    try {
        const db = await getDB();
        const games = db.collection("games");
        return (await games.find({status: 1}).toArray());
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