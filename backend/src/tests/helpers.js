import { STATUS } from "../config.js";
import { createEmptyBoard, createInitialBoard } from "../engine/board.js";

export function fixedRolls(...values) {
  return () => values.shift();
}

export function stateWith(points, overrides = {}) {
  const board = createEmptyBoard();

  for (const [index, owner, checkers] of points) {
    board[index] = { owner, checkers };
  }

  return {
    ...createInitialBoard(),
    board,
    status: STATUS.move,
    ...overrides,
  };
}
