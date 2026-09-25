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

export function isHome(index, player) {
  return player === WHITE ? index >= 0 && index < 6 : index > 17 && index < 24;
}

export function isValidPoint(point) {
  return Number.isInteger(point) && point >= 0 && point <= 23;
}

export function isValidStep(point, player) {
  return point.owner === null || point.owner === player || point.checkers === 1;
}

export function allCheckersHome(game, player) {
  return game.board.every((p, i) => p.owner !== player || isHome(i, player));
}

export function hasFartherChecker(board, player, distance) {
  return board.some(
    (p, i) => p.owner === player && distanceToExit(i, player) > distance,
  );
}

export function removeChecker(point) {
  point.checkers--;
  if (point.checkers === 0) point.owner = null;
}
