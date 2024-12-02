const { verify } = require("../auth/auth");
const { getIO } = require("../config/socket");
const { findGameUsingID } = require("../model/sgame");
const { findRoomUsingId, addPlayerToRoom, authenticRoomPassword } = require("../model/room");
const modifyGameData = require("../util/helper");

async function handleConnection (socket) {
    console.log("a user connected!", socket.id); 
    const {token} = socket.handshake.headers;
    const {username} = await verify(token);
    
    socket.on('watch:game', async({id}) => {
      socket.join(id.toString());
      const game = await findGameUsingID(id);
      socket.emit("ack", game)
    })

    socket.on("join:room", async({id, password}) => {
      try {
        if(await authenticRoomPassword(id, password)) {
          const document = await addPlayerToRoom(id, username);
          socket.join(id);
          socket.emit("ack", document);
        } else {
          socket.emit("ack", "Unauthorized! Incorrect room credentials");
          throw new Error("Unauthorized! Incorrect room credentials")
        }
      } catch (error) {
        console.error(error)
      }
    })

    socket.on("room:guess", async({id, guess}) => {
      const {gameId} = await findRoomUsingId(id);
      console.log(gameId);
      const {game, event} = await modifyGameData(gameId, guess);
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