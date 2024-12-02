const { createGame, findGameUsingID, updateGame, getAllActiveGames } = require('../model/game');
const { broadcastToRoom } = require('./socket');
const modifyGameData = require("../util/helper");


const gameStates = {
    "running": "running",
    "over": "over",
    "won" : "won"
}

async function initialise (req, res) {
    // const [RandWord] = (await axios.get("http://random-word-api.herokuapp.com/word")).data;
    try {
        const word = "test";
        const {username} = req.user;
        const game = {
            word: word,
            turns: 6,
            status: gameStates.running,
            display: Array(word.length).fill('_').join(""),
            player: username
        }
        await createGame(game);
        delete game.word;
        res.status(201).json(game) 
    } catch (error) {
        console.error(error)
        res.status(500).json(error);
    }
}

async function handleGuess (req, res) {
    const {id, guess} = req.body;
    const {username} = req.body;  

    try {
        const {game, event} = await modifyGameData(id, guess);
        if(game.player !== username) {
            res.status(401).json({message: "Only the owner can play the game"});
        }
        await updateGame(game);
        delete game.player;
        res.status(200).json(game);
        broadcastToRoom(id, `game:${event}`, game);
    } catch (error) {
        console.error(error);
        res.status(500).json(error)
    }

}

async function activeGames (req, res) {
    try {
        const activeGames = await getAllActiveGames();
        for(const game of activeGames) {
            delete game.word;
        }
        res.status(200).json(activeGames);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error});
    }
}

module.exports = {
    initialise,
    handleGuess,
    activeGames,
}