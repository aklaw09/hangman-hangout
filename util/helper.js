const { findGameUsingID } = require("../model/sgame");

const gameStates = {
    "running": "running",
    "over": "over",
    "won" : "won"
}

async function modifyGameData (gameId, guess) {
    let correctGuess = false, event = "update";
    const game = await findGameUsingID(gameId);
    console.log(game);
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
                event = "end";
            }
        }
    }
    game.display = game.display.join("");
    if(game.word === game.display) {
        game.status = gameStates.won;
        event = "win";
    }
    
    return {
        game: game,
        event: event
    };
}

module.exports = modifyGameData;