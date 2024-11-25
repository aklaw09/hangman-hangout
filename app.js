const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const axios = require('axios');
const cors = require('cors');
const {randomUUID} = require('crypto');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let ActiveGames = [];

app.get('/game', async(req, res) => {
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
        turns: ActiveGames[WordID].TurnsLeft
    });
})

app.post('/game', (req, res) => {
    const {id, guess} = req.body;
    if(ActiveGames[id]) {
        ActiveGames[id].TurnsLeft--;
        const MatchingIndices = [];
        let word = ActiveGames[id].Word;
        for(let i = 0; i < word.length; i++) {
            if(word[i] === guess)  {
                let updateDisplay = ActiveGames[id].Display.split("");
                updateDisplay[i] = guess;
                ActiveGames[id].Display = updateDisplay.join("");
                console.log(i, ActiveGames[id].Display, updateDisplay)
            }
        }
        console.log(ActiveGames[id])
        res.send({
            status: 200,
            id: id,
            word: ActiveGames[id].Display,
            turns: ActiveGames[id].TurnsLeft
        });
    }
    else {
        res.send({
            status: 404
        })
    }
})

app.listen(8080, () => {
    console.log("Hangman v1");
})