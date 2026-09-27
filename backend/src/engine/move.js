import { BLACK, WHITE, STATUS } from "../config.js";
import { fail } from "../utils/helper.js";
import {
  allCheckersHome,
  calculateDestination,
  distanceToExit,
  getBarDestination,
  hasFartherChecker,
  isValidPoint,
  isValidStep,
  placeChecker,
  removeChecker,
} from "../utils/move.js";

function validateBar(game, to, die, player) {
  if (game.bar[player] === 0) return fail("empty_bar", "No checker on bar");

  const destination = getBarDestination(die, player);
  if (to !== destination)
    return fail("invalid_destination", "Destination does not match die");
  if (!isValidStep(game.board[destination], player))
    return fail("blocked_point", "Point is blocked");
  return null;
}

function validateOff(game, from, die, player) {
  if (!allCheckersHome(game, player)) {
    return fail("cannot_bear_off", "All checkers nust be home");
  }

  const distance = distanceToExit(from, player);
  if (die < distance) return fail("cannot_bear_off", "Die is too small");
  if (die > distance && hasFartherChecker(game.board, player, distance)) {
    return fail("cannot_bear_off", "A farther checker must move first");
  }

  return null;
}

function validateRegularMove(game, from, to, die, player) {
  if (to === "off") return validateOff(game, from, die, player);

  if (!isValidPoint(to))
    return fail("invalid_destination", "Invalid destination");

  if (to !== calculateDestination(from, die, player))
    return fail("invalid_dest", "");

  if (!isValidStep(game.board[to], player)) return fail("blocked_point", "");
  return null;
}

export function validateMove(game, { from, to, die }) {
  const player = game.currentPlayer;

  if (game.status !== STATUS.move)
    return fail("invalid_state", "Status not in move");

  if (!Number.isInteger(die) || !game.remainingDice.includes(die)) {
    return fail("invalid_die", "Die is not available");
  }

  if (from === "bar") return validateBar(game, to, die, player);

  if (game.bar[player] > 0)
    return fail("bar_contain", "There is contain a bar");

  if (!isValidPoint(from))
    return fail("invalid_source", "Invalid source of point");

  if (game.board[from].owner !== player) {
    return fail("not_your_checker", "Not your checker");
  }

  return validateRegularMove(game, from, to, die, player);
}

export function getLegalMoves(game) {
  const player = game.currentPlayer;
  const moves = [];

  for (const die of new Set(game.remainingDice)) {
    const candidates = [
      { from: "bar", to: getBarDestination(die, player), die },
    ];

    game.board.forEach((point, from) => {
      if (point.owner !== player) return;
      const to = calculateDestination(from, die, player);
      candidates.push({ from, to: isValidPoint(to) ? to : "off", die });
    });

    for (const move of candidates) {
      if (validateMove(game, move) === null) moves.push(move);
    }
  }
  return moves;
}

export function gameMove(game, move) {
  const error = validateMove(game, move);
  if (error) return error;

  const next = structuredClone(game);
  const player = next.currentPlayer;
  const { from, to, die } = move;

  if (from === "bar") next.bar[player] -= 1;
  else removeChecker(next.board[from]);

  if (to === "off") next.borneOff[player] += 1;
  else placeChecker(next, to, player);

  next.remainingDice.splice(next.remainingDice.indexOf(die), 1);

  return { ok: true, game: resolveTurn(next) };
}

const opponent = (player) => (player === WHITE ? BLACK : WHITE);

export function resolveTurn(game) {
  const player = game.currentPlayer;

  if (game.borneOff[player] === 15) {
    return {
      ...game,
      dice: [],
      remainingDice: [],
      winner: player,
      status: STATUS.finished,
    };
  }

  const hasDice = game.remainingDice.length > 0;
  if (hasDice && getLegalMoves(game).length > 0) {
    return game;
  }

  return {
    ...game,
    currentPlayer: opponent(player),
    dice: [],
    remainingDice: [],
    status: STATUS.roll,
  };
}
