const { verify } = require("../auth/auth");
const { getIO } = require("../config/socket");
const { findGameUsingID } = require("../model/game");
const { findRoomUsingId, addPlayerToRoom, authenticRoomPassword } = require("../model/room");

async function handleConnection (socket) {
    console.log("a user connected!", socket.id); 
    const {token} = socket.handshake.headers;
    const {username} = await verify(token);
    console.log(username)

    socket.on('join:game', async({id}) => {
      socket.join(id);
      const game = await findGameUsingID(id);
      socket.emit("ack", game)
    })

    socket.on("join:room", async({id, password}) => {
      console.log(id, password)
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

    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    
}

function broadcastToRoom (roomId, event, message) {
  console.log(roomId, event, message)
  const io = getIO();
  io.to(roomId).emit(event, message);
}

async function join (roomId, password, username) {
  try {
      if(await authenticRoomPassword(roomId, password)) {
          
          return document;
      } else {
          throw new Error("Invalid credential")
      }
  } catch (error) {
      console.error(error);
      return false;
  }
}


module.exports = {
  handleConnection,
  broadcastToRoom
};