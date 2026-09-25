import { WHITE } from "../config.js";

export function calculateDestination(from, die, player) {
  return player === WHITE ? from - die : from + die;
}

export function getBarDestination(die, player) {
  return player === WHITE ? 24 - die : die - 1;
}

export function distanceToExit(index, player) {
  return player === WHITE ? index + 1 : 24 - index;
}
