import { describe, it } from "node:test";
import assert from "assert/strict";
import { startGame, rollDice } from "../../engine/turn.js";
import { BLACK, STATUS, WHITE } from "../../config.js";
import { fixedRolls } from "../helpers.js";

describe("opening roll", () => {
  it("lets black open when black rolls higher", () => {
    const { game } = startGame(fixedRolls(2, 5));

    assert.equal(game.currentPlayer, BLACK);
    assert.equal(game.status, STATUS.move);
    assert.deepEqual(game.remainingDice, [2, 5]);
  });

  it("rerolls on a tie", () => {
    const { game } = startGame(fixedRolls(2, 2, 2, 5));

    assert.equal(game.currentPlayer, BLACK);
    assert.deepEqual(game.dice, [2, 5]);
  });
});
