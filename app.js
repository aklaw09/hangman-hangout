const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const socketio = require("socket.io");
const game = require("./routes/game");
const room = require("./routes/room");
const handleConnection = require('./controller/socket');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

io.on('connection', handleConnection);
app.use('/', room);
app.use('/game', game);

server.listen(8080, () => {
    console.log("Hangman v1");
})