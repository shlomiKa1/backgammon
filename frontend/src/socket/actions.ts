import type { ActionResult, Move, RoomResult } from "../types";
import { socket } from "./socket";

const TIMEOUT_RESULT = {
  success: false,
  error: { code: "timeout", message: "Server did not respond" },
} as const;

async function send<T>(event: string, ...args: unknown[]): Promise<T> {
  try {
    return await socket.timeout(5000).emitWithAck(event, ...args);
  } catch {
    return TIMEOUT_RESULT as T;
  }
}

export function createRoom(name: string) {
  return send<RoomResult>("room:create", { name });
}

export function joinRoom(roomCode: string, name: string) {
  return send<RoomResult>("room:join", { roomCode, name });
}

export function leaveRoom() {
  return send<RoomResult>("room:leave");
}

export function startGame() {
  return send<ActionResult>("game:start");
}
export function rollDice() {
  return send<ActionResult>("game:roll");
}

export function moveChecker(move: Move) {
  return send<ActionResult>("game:move", move);
}

export function requestRematch() {
  return send<ActionResult>("game:request-rematch");
}
