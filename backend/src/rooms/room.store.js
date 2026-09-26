const rooms = new Map();
const socketToRoom = new Map();

export const saveRoom = (room) => rooms.set(room.id, room);
export const getRoom = (roomCode) => rooms.get(roomCode);
export const hasRoom = (roomCode) => rooms.has(roomCode);
export const deleteRoom = (roomCode) => rooms.delete(roomCode);

export const SetSocketToRoom = (socketId, roomCode) =>
  socketToRoom.set(socketId, roomCode);

export const getRoomCodeBySocket = (socketId) => socketToRoom.get(socketId);
export const removeSocket = (socketId) => socketToRoom.delete(socketId);

// For unit test
export function clearStore() {
  rooms.clear();
  socketToRoom.clear();
}
