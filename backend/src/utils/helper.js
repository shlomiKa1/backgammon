import { WHITE } from "../config.js";

export function pointToIndex(point, player) {
  return player === WHITE ? point - 1 : 24 - point;
}

export function fail(code, message) {
  return { ok: false, error: { code, message } };
}
