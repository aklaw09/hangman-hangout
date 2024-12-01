const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

async function createRoom (document) {
    try {
        const db = await getDB();
        const rooms = db.collections("rooms");
        await rooms.insertOne(document);
        delete document.password;
        return document;
    } catch (error) {
        throw new Error(error);
    }
}

async function getAllActiveRooms () {
    try {
        const db = await getDB();
        const rooms = db.collection("rooms");
        const activeMultiplayerRooms = await rooms.find().toArray();
        for(const room of activeMultiplayerRooms) {
            delete room.password;
        }
        return activeMultiplayerRooms;
    } catch (error) {
        throw new Error(error);
    }
}

async function authenticRoomPassword (id, password) {
    try {
        const db = await getDB();
        const rooms = db.collection("rooms");
        const objId = ObjectId.createFromHexString(id)
        const room = (await rooms.find({"_id": objId}).toArray())[0];
        console.log(room.password, password)
        if(room.password === password ) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        throw new Error(error)
    }
}

async function addPlayerToRoom (id, username) {
    try {
        const db = await getDB();
        const rooms = db.collection("rooms");
        const objId = ObjectId.createFromHexString(id)
        const document = (await rooms.find({"_id" : objId}).toArray())[0];
        delete document.password;
        document.players.push(username);
        const res = await rooms.updateOne({"_id" : id}, {"$set" : document});
        console.log(res);
        return document;
    } catch (error) {
        console.error(error);
        throw new Error(error)
    }
}

module.exports = {
    createRoom,
    getAllActiveRooms,
    authenticRoomPassword,
    addPlayerToRoom
}