const {randomUUID} = require('crypto');
const { createGame, findGameUsingID, updateGame, getAllActiveGames } = require('../model/game');
const { getIO } = require('../config/socket');
const { broadcastToRoom } = require('./socket');

const gameStates = {
    "running": "running",
    "over": "over",
    "won" : "won"
}

async function initialise (req, res) {
    // const [RandWord] = (await axios.get("http://random-word-api.herokuapp.com/word")).data;
    try {
        const word = "test"
        const game = {
            word: word,
            turns: 6,
            status: gameStates.running,
            display: Array(word.length).fill('_').join(""),
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
    const {id, guess} = req.body;   let correctGuess = false, event = "game:update";
    const game = await findGameUsingID(id);
    const gameId = game["_id"].toString();

    if(!game) {
        res.status(404).json({message: "Error! Game not found"});
    } else {
        try {
            const word = game.word; game.display = game.display.split("");
            for(let i=0; i < word.length; i++) {
                if(word[i] === guess) {
                    correctGuess = true;
                    game.display[i] = guess;
                }
                if(i === game.word.length - 1 && !correctGuess) {
                    game.turns--;
                    if(game.turns === 0) {
                        game.status = gameStates.over;
                        event = "game:end";
                    }
                }
            }
            game.display = game.display.join("");
            if(game.word === game.display) {
                game.status = gameStates.won;
                event = "game:win";
            }
            await updateGame(game);
            res.status(200).json(game);
            
            broadcastToRoom(gameId, event, game);
        } catch (error) {
            console.error(error);
            res.status(500).json(error)
        }
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
    activeGames
}