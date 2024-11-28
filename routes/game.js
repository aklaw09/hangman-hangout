const express = require("express");
const router = express.Router();
const game = require("../controller/game")

router.get('/', game.initialise);

router.post('/', game.handleGuess)

module.exports = router;