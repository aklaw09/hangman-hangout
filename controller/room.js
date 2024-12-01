const { getDB, connectToDB } = require("../config/db");
const { authenticRoomPassword, createRoom, getAllActiveRooms, addPlayerToRoom } = require("../model/room");


async function listCurrent (req, res) {
    try {
        const rooms = await getAllActiveRooms();
        res.status(200).json(rooms);    
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }    
}

async function initialise (req, res) {
    try {
        const {hasPassword, password} = req.body;
        const document = {
            players: [username],
            gameMaster: username,
            password: password,
            passwordProtected: hasPassword
        }
        document = await createRoom(document);
        res.status(201).json(document);
    } catch (error) {
        res.status(500).json(error);
    }
}

async function join (req, res) {console.log("Joing room")
    try {
        const {roomId, password} = req.body;
        const {username} = req.user;

        if(await authenticRoomPassword(roomId, password)) {
            const document = await addPlayerToRoom(roomId, username);
            res.status(200).json(document);
        } else {
            throw new Error("Invalid credential")
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
}

module.exports = {
    listCurrent,
    initialise,
    join
}