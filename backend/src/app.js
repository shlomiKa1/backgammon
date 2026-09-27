import http from "http";
import { Server } from "socket.io";
import { registerRoomHandlers } from "./socket/room.handler.js";
import { PORT } from "./config.js";
import { registerGameHandlers } from "./socket/game.handlers.js";

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

io.on("connection", (socket) => {
  registerRoomHandlers(io, socket);
  registerGameHandlers(io, socket);
});

server.on("error", (err) => {
  console.error(`Server error: ${err.message}`);
  process.exit(1);
});

server.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
