import { it, describe } from "node:test";
import assert from "assert/strict";
import { stateWith } from "../helpers.js";
import { BLACK, WHITE } from "../../config.js";
import { gameMove } from "../../engine/move.js";

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
