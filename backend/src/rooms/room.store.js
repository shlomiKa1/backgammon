const rooms = new Map();
const socketRoRoom = new Map();

export const saveRoom = (room) => rooms.set(room.id, room);
export const getRoom = (roomCode) => rooms.get(roomCode);
export const hasRoom = (roomCode) => rooms.has(roomCode);
export const deleteRoom = (roomCode) => rooms.delete(roomCode);
