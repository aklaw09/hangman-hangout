const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const socketio = require("socket.io");
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const {handleConnection} = require('./controller/socket');
const { init } = require('./config/socket');

const app = express();
const server = http.createServer(app);
const io = init(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

io.on('connection', handleConnection);
app.use('/auth', authRoutes);
app.use('/api', protectedRoutes);

server.listen(8080, () => {
    console.log("Hangman v1");
})