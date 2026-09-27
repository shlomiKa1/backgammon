import { BLACK, ROOM_STATUS, STATUS, WHITE } from "../config.js";
import { gameMove, getLegalMoves } from "../engine/move.js";
import { rollDice, startGame } from "../engine/turn.js";
import { fail, rollingDie } from "../utils/helper.js";
import { getRoom, getRoomCodeBySocket } from "./room.store.js";

function getContext(socketId) {
  const roomCode = getRoomCodeBySocket(socketId);
  const room = roomCode && getRoom(roomCode);
  if (!room) return fail("not_in_room", "Not in a room");

  const player = room.players.find((p) => p.socketId === socketId);
  return { ok: true, room, player };
}

function checkTurn(room, player) {
  if (room.status !== ROOM_STATUS.playing)
    return fail("invalid_state", "Game is not running");

  if (player.color !== room.game.currentPlayer)
    return fail("not_your_turn", "Not your turn");
  return null;
}

export function toPublicGame(game) {
  return game && { ...game, legalMoves: getLegalMoves(game) };
}

export function startMatch(socketId, roll = rollingDie) {
  const context = getContext(socketId);
  if (!context.ok) return context;
  const { room } = context;

  if (room.ownerSocketId !== socketId)
    return fail("not_owner", "Only the room owner can start");

  if (room.status !== ROOM_STATUS.waiting)
    return fail("invalid_state", "Game already started");

  if (room.players.length !== 2)
    return fail("not_enough_players", "Two and only two players are required");

  room.game = startGame(roll).game;
  room.status = ROOM_STATUS.playing;
  return { ok: true, room };
}

export function rollTurn(socketId, roll = rollingDie) {
  const context = getContext(socketId);
  if (!context.ok) return context;
  const { room, player } = context;

  const turnError = checkTurn(room, player);
  if (turnError) return turnError;

  const result = rollDice(room.game, roll);
  if (!result.ok) return result;

  room.game = result.game;
  return { ok: true, room };
}

export function playMove(socketId, move) {
  const context = getContext(socketId);
  if (!context.ok) return context;
  const { room, player } = context;

  const turnError = checkTurn(room, player);
  if (turnError) return turnError;

  if (!move || typeof move !== "object")
    return fail("invalid_move", "Invalid move");

  const result = gameMove(room.game, move);
  if (!result.ok) return result;

  room.game = result.game;

  if (room.game.status === STATUS.finished) {
    room.status = ROOM_STATUS.finished;
    const winner = room.players.find((p) => p.color === room.game.winner);
    return {
      ok: true,
      room,
      winner: { color: winner.color, name: winner.name },
    };
  }
  return { ok: true, room };
}

export function requestRematch(socketId, roll = rollingDie) {
  const context = getContext(socketId);
  if (!context.ok) return context;
  const { room } = context;

  if (room.status !== ROOM_STATUS.finished)
    return fail("invalid_state", "Game is not finished");

  if (!room.rematchAcceptedBy.includes(socketId)) {
    room.rematchAcceptedBy.push(socketId);
  }

  if (room.rematchAcceptedBy.length < 2)
    return { ok: true, room, started: false };

  for (const player of room.players) {
    player.color = player.color === WHITE ? BLACK : WHITE;
  }

  room.game = startGame(roll).game;
  room.status = ROOM_STATUS.playing;
  room.rematchAcceptedBy = [];
  return { ok: true, room, started: true };
}
