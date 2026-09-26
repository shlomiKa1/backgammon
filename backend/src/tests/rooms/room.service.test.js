import { describe, it } from "node:test";
import assert from "assert/strict";
import { saveRoom } from "../../rooms/room.store.js";
import { generateRoomCode } from "../../rooms/room.service.js";
import { fixedRolls } from "../helpers.js";

describe("generate code room", () => {
  it("rerolls when the code is taken", () => {
    saveRoom({ id: "AAAAAA" });
    const code = generateRoomCode(
      fixedRolls(0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1),
    );

    assert.equal(code, "BBBBBB")
  });
});
