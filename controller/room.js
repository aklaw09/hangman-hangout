const { createGame } = require("../model/game");
const { createRoom, getAllActiveRooms, findRoomUsingId, addGameToRoom } = require("../model/room");
const { gameStates, gameCollection } = require("../util/helper");
const { broadcastToRoom } = require("./socket");

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
        const {username} = req.user;
        let document = {
            players: [username],
            gameMaster: 0,
            password: password,
            passwordProtected: hasPassword,
            gameId: null
        }
        document = await createRoom(document);
        res.status(201).json(document);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
}

async function start (req, res) {
    try {
        const DEFAULT_GUESS_LIMIT = 6;
        let {roomId, systemGenerated, guessLimit, word} = req.body;
        const {username} = req.user;

        const room = await findRoomUsingId(roomId);
        const gameMaster = room.players[room.gameMaster];
        if(gameMaster !== username) {
            return res.status(401).json({message: "Unauthorized! Only the game master can start the game."});
        }
        if(systemGenerated) word = "test";
        if(!guessLimit) guessLimit = DEFAULT_GUESS_LIMIT;
        const game = {
            word: word,
            turns: guessLimit,
            status: gameStates.running,
            display: Array(word.length).fill('_').join(""),
        }
        await createGame(game, gameCollection.multiplayer);
        await addGameToRoom(room, game["_id"].toString())
        delete game.word;
        broadcastToRoom(roomId, "room:start", game);
        res.status(201).json(game) 
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
}

module.exports = {
    listCurrent,
    initialise,
    start
}