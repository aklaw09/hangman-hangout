const { verify } = require("../auth/auth");
const { getIO } = require("../config/socket");
const { findGameUsingID, updateGame } = require("../model/game");
const { findRoomUsingId, addPlayerToRoom, authenticRoomPassword } = require("../model/room");
const { gameCollection, modifyGameData } = require("../util/helper");

async function handleConnection (socket) {
    console.log("a user connected!", socket.id); 
    const {token} = socket.handshake.headers;
    const {username} = await verify(token);
    
    socket.on('watch:game', async({id}) => {
      socket.join(id.toString());
      const game = await findGameUsingID(id, gameCollection.singlePlayer);
      socket.emit("ack", game)
    })

    socket.on("join:room", async({roomId, password}) => {
      try {
        if(await authenticRoomPassword(roomId, password)) {
          const document = await addPlayerToRoom(roomId, username);
          socket.join(roomId);
          socket.emit("ack", document);
        } else {
          socket.emit("ack", "Unauthorized! Incorrect room credentials");
          throw new Error("Unauthorized! Incorrect room credentials")
        }
      } catch (error) {
        console.error(error)
      }
    })

    socket.on("room:guess", async({roomId, guess}) => {
      const {gameId} = await findRoomUsingId(roomId);
      const {game, event} = await modifyGameData(gameId, guess, gameCollection.multiplayer);
      await updateGame(game, gameCollection.multiplayer);
      broadcastToRoom(roomId, `room:${event}`, game);
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    
}

function broadcastToRoom (roomId, event, message) {
  const io = getIO();
  io.to(roomId).emit(event, message);
}



module.exports = {
  handleConnection,
  broadcastToRoom
};