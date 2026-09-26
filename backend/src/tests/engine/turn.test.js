import { describe, it } from "node:test";
import assert from "assert/strict";
import { startGame, rollDice } from "../../engine/turn.js";
import { BLACK, STATUS, WHITE } from "../../config.js";
import { fixedRolls, stateWith } from "../helpers.js";

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

describe("rolling", () => {
  it("regects rolling in the middle of a turn", () => {
    const { game } = startGame(fixedRolls(6, 1));
    const result = rollDice(game);

    assert.equal(result.ok, false);
    assert.equal(result.error.code, "invalid_state");
  });

  it("gives four dice on doubles", () => {
    const state = stateWith([[12, "white", 1]], { status: STATUS.roll });
    const { game } = rollDice(state, fixedRolls(4, 4));

    assert.deepEqual(game.remainingDice, [4, 4, 4, 4]);
  });
});
