function handleConnection (socket) {
    console.log("a user connected!")

    socket.on('join', (options) => {
        const {UserID, Room} = options;
    });

    socket.on('create', console.log);

    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    
}

function broadcastToRoom (RoomId) {
    
}

module.exports = handleConnection;