const { getDB } = require("../config/db");

async function insertToRooms (document) {
    try {
        const db = await getDB();
        const rooms = db.collections("rooms");
        const result = await rooms.insertOne(document);
        console.log(result);
    } catch (error) {
        console.log(error);
    }
}