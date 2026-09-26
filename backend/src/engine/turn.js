import { BLACK, STATUS, WHITE } from "../config.js";
import { getLegalMoves } from "./move.js";
import { createInitialBoard } from "./board.js";

export function startGame(roll = rollingDie) {
  const game = createInitialBoard();

  let dieWhite = roll();
  let dieBlack = roll();

  while (dieWhite === dieBlack) {
    dieWhite = roll();
    dieBlack = roll();
  }

  const next = {
    ...game,
    currentPlayer: dieWhite > dieBlack ? WHITE : BLACK,
    dice: [dieWhite, dieBlack],
    remainingDice: [dieWhite, dieBlack],
    status: STATUS.move,
  };

  return { ok: true, game: resolveTurn(next) };
}

import { fail, rollingDie } from "../utils/helper.js";

export function rollDice(game, roll = rollingDie) {
  if (game.status !== STATUS.roll)
    return fail("invalid_state", "Not waiting for a roll");

  const die1 = roll();
  const die2 = roll();

  const next = {
    ...game,
    dice: [die1, die2],
    remainingDice: die1 === die2 ? [die1, die1, die1, die1] : [die1, die2],
    status: STATUS.move,
  };

  return { ok: true, game: resolveTurn(next) };
}

const opponent = (player) => (player === WHITE ? BLACK : WHITE);

function resolveTurn(game) {
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
