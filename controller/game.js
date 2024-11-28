const {randomUUID} = require('crypto');

let ActiveGames = [];
const RUNNING = 1, OVER = 0, WON = 2;

async function initialise (req, res) {
    // const [RandWord] = (await axios.get("http://random-word-api.herokuapp.com/word")).data;
    const RandWord = "test"
    const WordID = randomUUID();
    ActiveGames[WordID] = {
        Word: RandWord,
        TurnsLeft: 6,
        Display: Array(RandWord.length).fill('_').join("")
    };
    res.send({
        id: WordID,
        word: ActiveGames[WordID].Display,
        turns: ActiveGames[WordID].TurnsLeft,
        gameStatus: RUNNING
    });
}

function handleGuess (req, res) {
    const {id, guess} = req.body;   let gameStatus = RUNNING, correctGuess = false;
    if(ActiveGames[id]) {
        let word = ActiveGames[id].Word;
        for(let i = 0; i < word.length; i++) {
            if(word[i] === guess)  {
                correctGuess = true;
                let updateDisplay = ActiveGames[id].Display.split("");
                updateDisplay[i] = guess;
                ActiveGames[id].Display = updateDisplay.join("");
                console.log(i, ActiveGames[id].Display, updateDisplay)
            }
        }
        if(!correctGuess) ActiveGames[id].TurnsLeft--;
        if (ActiveGames[id].Display === word){
            gameStatus = WON;
        } else if(ActiveGames[id].TurnsLeft === 0) gameStatus = OVER;
        res.send({
            status: 200,
            id: id,
            word: ActiveGames[id].Display,
            turns: ActiveGames[id].TurnsLeft,
            gameStatus: gameStatus
        });
    }
    else {
        res.send({
            status: 404
        })
    }
}

module.exports = {
    initialise,
    handleGuess
}