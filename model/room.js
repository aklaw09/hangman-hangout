const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

async function createRoom (document) {
    try {
        const db = await getDB();
        const rooms = db.collection("rooms");
        await rooms.insertOne(document);
        delete document.password;
        return document;
    } catch (error) {
        throw new Error(error);
    }
}

async function findRoomUsingId (roomId) {
    try {
        const db = await getDB();
        const rooms = db.collection("rooms");
        const objId = ObjectId.createFromHexString(roomId)
        let roomData = (await rooms.find({"_id": objId}).toArray())[0];
        delete roomData.password;
        return roomData;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

async function addGameToRoom (room, gameId) {
    try {
        const db = await getDB();
        const rooms = db.collection("rooms");
        const objId = ObjectId.createFromHexString(room["_id"])
        room.gameId = gameId;
        delete room["_id"]
        await rooms.updateOne({"_id": objId} , { $set : room});
        return room;
    } catch (error) {
        throw new Error(error)
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
        if(!document.players.find((players) => players === username)) {
            document.players.push(username);
        }
        delete document.password;
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
    addPlayerToRoom,
    findRoomUsingId,
    addGameToRoom
}