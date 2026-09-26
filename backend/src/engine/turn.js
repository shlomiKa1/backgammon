import { BLACK, STATUS, WHITE } from "../config.js";
import { getLegalMoves } from "./move.js";

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
