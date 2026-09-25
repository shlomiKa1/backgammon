import { it, describe } from "node:test";
import assert from "assert/strict";
import { stateWith } from "../helpers.js";
import { BLACK, WHITE } from "../../config.js";
import { gameMove } from "../../engine/move.js";

const pointPlace = (owner, checkers) => ({ owner, checkers });
describe("blocked point", () => {
  it("rejects moving onto tow opponent checkers", () => {
    const state = stateWith(
      [
        [12, WHITE, 1],
        [9, BLACK, 2],
      ],
      { remainingDice: [3] },
    );

    const result = gameMove(state, { from: 12, to: 9, die: 3 });

    assert.equal(result.ok, false);
    assert.equal(result.error.code, "blocked_point");
  });
});

describe("hitting", () => {
  it("sends a single oppnent to bar", () => {
    const state = stateWith(
      [
        [12, WHITE, 1],
        [9, BLACK, 1],
      ],
      { remainingDice: [3, 5] },
    );

    const { game } = gameMove(state, { from: 12, to: 9, die: 3 });

    assert.deepEqual(game.board[9], pointPlace(WHITE, 1));
    assert.equal(game.bar[BLACK], 1);
    assert.deepEqual(game.board[12], pointPlace(null, 0));
  });
});

describe("bar", () => {
  it("forces entering from the bar before any other move", () => {
    const state = stateWith([[12, WHITE, 1]], {
      bar: { white: 1, black: 0 },
      remainingDice: [3],
    });

    console.log(state);

    const result = gameMove(state, { from: 12, to: 9, die: 3 });

    assert.equal(result.ok, false);
    assert.equal(result.error.code, "bar_contain");
  });

  it("allows entering from the bar", () => {
    const state = stateWith([], {
      bar: { white: 1, black: 0 },
      remainingDice: [3],
    });

    const result = gameMove(state, { from: "bar", to: 21, die: 3 });

    assert.equal(result.ok, true);
    assert.equal(result.game.bar.white, 0);
  });
});
