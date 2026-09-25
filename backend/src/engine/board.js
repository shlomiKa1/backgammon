import { BLACK, OPENING_LAYOUT, WHITE } from "../config.js";
import { pointToIndex } from "../utils/helper.js";

function createEmptyBoard() {
  return Array(24)
    .fill(null)
    .map(() => ({ owner: null, checkers: 0 }));
}

export function createInitialBoard() {
  const board = createEmptyBoard();

  for (const player of [WHITE, BLACK]) {
    for (const { point, count } of OPENING_LAYOUT) {
      board[pointToIndex(point, player)] = { owner: player, checkers: count };
    }
  }

  return {
    board,
    currentPlayer: WHITE,
    dice: [],
    remainingDice: [],
    bar: { white: 0, black: 0 },
    borneOff: { white: 0, black: 0 },
    status: "waiting-for-roll",
    winner: null,
  };
}

export function countCheckers(state, player) {
  const onBoard = state.board
    .filter((point) => point.owner === player)
    .reduce((sum, point) => sum + point, 0);

  return onBoard + state.boardOff[player] + state.bar[player];
}
