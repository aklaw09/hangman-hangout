const {randomUUID} = require('crypto');
const { createGame, findGameUsingID, updateGame, getAllActiveGames } = require('../model/game');

let ActiveGames = [];
const RUNNING = 1, OVER = 0, WON = 2;

async function initialise (req, res) {
    // const [RandWord] = (await axios.get("http://random-word-api.herokuapp.com/word")).data;
    try {
        const RandWord = "test"
        const game = {
            word: RandWord,
            turns: 6,
            status: RUNNING,
            display: Array(RandWord.length).fill('_').join("")
        }
        await createGame(game);
        delete game.word;
        res.status(201).json(game)    
    } catch (error) {
        console.error(error)
        res.status(500)
    }
}

async function handleGuess (req, res) {
    const {id, guess} = req.body;   let gameStatus = RUNNING, correctGuess = false;
    const game = await findGameUsingID(id);

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
                    if(game.turns === 0) game.status = OVER;
                }
            }
            game.display = game.display.join("");
            if(game.word === game.display) {
                game.status = WON;
            }
            await updateGame(game);
            res.status(200).json(game);
        } catch (error) {
            console.error(error);
            res.status(500).json(error)
        }
    }
}

async function activeGames (req, res) {
    try {
        const activeGames = await getAllActiveGames();
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