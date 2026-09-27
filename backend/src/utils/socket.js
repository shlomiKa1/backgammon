import { toPublicRoom } from "../rooms/room.service.js";

export const safe = (callback) =>
  typeof callback === "function" ? callback : () => {};

export function broadcastRoom(io, room) {
  const publicRoom = toPublicRoom(room);
  for (const player of room.players) {
    io.to(player.socketId).emit("room:state", {
      ...publicRoom,
      yourColor: player.color,
    });
  }
}
