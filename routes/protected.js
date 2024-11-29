const express = require('express');
const { authenticateToken } = require('../auth/auth');
const router = express.Router();
const game = require("../controller/game")
const room = require("../controller/room")

router.get('/game/create', game.initialise);
router.get('/games', game.activeGames);
router.post('/game', game.handleGuess);
router.get('/rooms', room.listCurrent);


module.exports = router;
