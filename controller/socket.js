const { getAllActiveGames } = require("../model/game");
const { initialise } = require("./game");

async function handleConnection (socket) {
    console.log("a user connected!", socket.id);

    const activeGames = await getAllActiveGames();
    socket.emit("init", JSON.stringify(activeGames));

    socket.on('join', ({id}) => {
      socket.join(id);
      console.log(`Joined room ${id}`);
      socket.emit("ack", `Watching game ${id}`)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    
}

function broadcastToRoom (RoomId) {
    
}

module.exports = handleConnection;