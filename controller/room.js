const { getDB, connectToDB } = require("../config/db");


async function listCurrent (req, res) {
    const db = await getDB();
    const rooms = db.collection("rooms");
    res.send(await rooms.find().toArray())
    
}

async function createRoom (RoomDocument) {
    const db = await getDB();
    const rooms = db.collection("rooms");
    rooms.insertOne(RoomDocument);
}

module.exports = {
    listCurrent
}