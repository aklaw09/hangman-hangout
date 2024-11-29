let io;

const init = (server) => {
  const { Server } = require("socket.io");
  io = new Server(server);
  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

module.exports = { init, getIO };
