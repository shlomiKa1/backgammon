import {
  BLACK,
  CODE_ALPHABET,
  CODE_LENGTH,
  MAX_NAME_LENGTH,
  ROOM_STATUS,
  WHITE,
} from "../config.js";
import { fail } from "../utils/helper.js";
import {
  getRoom,
  getRoomCodeBySocket,
  hasRoom,
  saveRoom,
  SetSocketToRoom,
} from "./room.store.js";

const randomIndex = () => Math.floor(Math.random() * CODE_ALPHABET.length);

export function generateRoomCode(pickIndex = randomIndex) {
  let code = "";

  do {
    code = "";
    for (let i = 0; i < CODE_LENGTH; i++) {
      code += CODE_ALPHABET[pickIndex()];
    }
  } while (hasRoom(code));

  return code;
}

function cleanName(name) {
  if (typeof name !== "string") return null;
  const trimmed = name.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_NAME_LENGTH) return null;
  return trimmed;
}

export function createRoom(socketId, name, pickIndex = randomIndex) {
  if (getRoomCodeBySocket(socketId))
    return fail("already_in_room", "Already in a room");

  const playerName = cleanName(name);
  if (!playerName) return fail("invalid_name", "Name must be 1-20 chararcters");

  const room = {
    id: generateRoomCode(pickIndex),
    status: ROOM_STATUS.waiting,
    ownerSocketId: socketId,
    players: [{ socketId, name: playerName, color: WHITE }],
    game: null,
    rematchAcceptedBy: [],
  };

  saveRoom(room);
  SetSocketToRoom(socketId, room.id);

  return { ok: true, room, color: WHITE };
}

export function joinRoom(socketId, roomCode, name) {
  if (getRoomCodeBySocket(socketId))
    return fail("already_in_room", "Alraeady in a room");

  const playerName = cleanName(name);
  if (!playerName) return fail("invalid_name", "Name must be 1-20 characters");

  if (typeof roomCode !== "string")
    return fail("room_not_found", "Room not found");
  const room = getRoom(roomCode.trim().toUpperCase());

  if (!room) return fail("room_not_found", "Room not found");
  if (room.status !== ROOM_STATUS.waiting)
    return fail("room_not_available", "Game already stared");
  if (room.players.length >= 2) return fail("room_full", "Room is full");

  room.players.push({ socketId, name: playerName, color: BLACK });
  SetSocketToRoom(socketId, room.id);

  return { ok: true, room, color: BLACK };
}
