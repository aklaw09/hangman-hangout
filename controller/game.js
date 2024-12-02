const { createGame, updateGame, getAllActiveGames } = require('../model/game');
const { gameCollection, modifyGameData, gameStates, generateRandomWord } = require('../util/helper');
const { broadcastToRoom } = require('./socket');

async function initialise (req, res) {
    try {
        const word = await generateRandomWord();
        const {username} = req.user;
        const game = {
            word: word,
            turns: 6,
            status: gameStates.running,
            display: Array(word.length).fill('_').join(""),
            player: username
        }
        await createGame(game, gameCollection.singlePlayer);
        delete game.word;
        res.status(201).json(game) 
    } catch (error) {
        console.error(error)
        res.status(500).json(error);
    }
}

async function handleGuess (req, res) {
    const {id, guess} = req.body;
    if(guess.length > 1) return res.status(400).json({message: "Guess cannot be larger than 1 character"})
    const {username} = req.user;  

    try {
        const {game, event} = await modifyGameData(id, guess, gameCollection.singlePlayer);
        if(game.player !== username) {
            res.status(401).json({message: "Only the owner can play the game"});
        }
        await updateGame(game, gameCollection.singlePlayer);
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
        const activeGames = await getAllActiveGames(gameCollection.singlePlayer);
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