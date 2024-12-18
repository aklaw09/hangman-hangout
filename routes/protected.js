const express = require('express');
const { authenticateToken } = require('../auth/auth');
const router = express.Router();
const game = require("../controller/game")
const room = require("../controller/room")

router.post('/game/create', authenticateToken, game.initialise);
router.get('/game', authenticateToken, game.activeGames);
router.post('/game', authenticateToken, game.handleGuess);
router.post('/room/create', authenticateToken, room.initialise);
router.post('/room/start', authenticateToken, room.start);
// router.post('/room/join', authenticateToken,  room.join)
router.get('/room', room.listCurrent);


module.exports = router;
