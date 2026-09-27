import {
  createRoom,
  joinRoom,
  leaveRoom,
  toPublicRoom,
} from "../rooms/room.service.js";
import { broadcastRoom, safe } from "../utils/socket.js";

function closeRoom(io, socket, reason) {
  const result = leaveRoom(socket.id);
  if (!result.ok) return result;

  for (const socketId of result.remainingSocketIds) {
    io.to(socketId).emit("room:closed", { reason });
  }

  io.in(result.roomCode).socketsLeave(result.roomCode);
  return result;
}
export function registerRoomHandlers(io, socket) {
  socket.on("room:create", (payload, callback) => {
    const reply = safe(callback);

    const result = createRoom(socket.id, payload?.name);
    if (!result.ok) return reply({ success: false, error: result.error });

    socket.join(result.room.id);
    reply({
      success: true,
      room: toPublicRoom(result.room),
      yourColor: result.color,
    });
  });

  socket.on("room:join", (payload, callback) => {
    const reply = safe(callback);

    const result = joinRoom(socket.id, payload?.roomCode, payload?.name);
    if (!result.ok) return reply({ success: false, error: result.error });

    socket.join(result.room.id);
    reply({
      success: true,
      room: toPublicRoom(result.room),
      yourColor: result.color,
    });

    broadcastRoom(io, result.room);
  });

  socket.on("room:leave", (callback) => {
    const reply = safe(callback);

    const result = closeRoom(io, socket, "player_left");
    reply(
      result.ok ? { success: true } : { success: false, error: result.error },
    );
  });

  socket.on("disconnect", () => {
    closeRoom(io, socket, "player_disconnected");
  });
}
