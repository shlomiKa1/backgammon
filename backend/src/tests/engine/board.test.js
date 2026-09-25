import { it, describe } from "node:test";
import assert from "assert/strict";
import { countCheckers, createInitialBoard } from "../../engine/board.js";
import { BLACK, WHITE } from "../../config.js";

describe("board", () => {
  it("starts with 15 checkers per color", () => {
    const game = createInitialBoard();
    
    assert.equal(countCheckers(game, WHITE), 15);
    assert.equal(countCheckers(game, BLACK), 15);
  });

  it("places white checkers according to section 3", () => {
    const game = createInitialBoard();

    assert.deepEqual(game.board[23], { owner: WHITE, checkers: 2 });
    assert.deepEqual(game.board[12], { owner: WHITE, checkers: 5 });
    assert.deepEqual(game.board[7], { owner: WHITE, checkers: 3 });
    assert.deepEqual(game.board[5], { owner: WHITE, checkers: 5 });
  });

  it("places 'black' checkers according to section 3", () => {
    const game = createInitialBoard();

    assert.deepEqual(game.board[0], { owner: BLACK, checkers: 2 });
    assert.deepEqual(game.board[11], { owner: BLACK, checkers: 5 });
    assert.deepEqual(game.board[16], { owner: BLACK, checkers: 3 });
    assert.deepEqual(game.board[18], { owner: BLACK, checkers: 5 });
  });

  it("creates a new board for every game", () => {
    const first = createInitialBoard();
    const second = createInitialBoard();

    first.board[0].checkers = 99;
    assert.equal(second.board[0].checkers, 2);
  });
});
