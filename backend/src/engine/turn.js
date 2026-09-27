import { BLACK, STATUS, WHITE } from "../config.js";
import { fail, rollingDie } from "../utils/helper.js";
import { createInitialBoard } from "./board.js";
import { resolveTurn } from "./move.js";

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
