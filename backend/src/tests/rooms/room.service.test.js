import { describe, it } from "node:test";
import assert from "assert/strict";
import { saveRoom } from "../../rooms/room.store.js";
import { createRoom, generateRoomCode } from "../../rooms/room.service.js";
import { fixedRolls } from "../helpers.js";
import { WHITE } from "../../config.js";

describe("generate code room", () => {
  it("rerolls when the code is taken", () => {
    saveRoom({ id: "AAAAAA" });
    const code = generateRoomCode(
      fixedRolls(0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1),
    );

    assert.equal(code, "BBBBBB");
  });
});

describe("create room", () => {
  it("creates a room with the creator as white owner", () => {
    const result = createRoom("s1", "dana");

    assert.equal(result.ok, true);
    assert.equal(result.color, WHITE);
    assert.equal(result.room.ownerSocketId, "s1");
  });

  it("rejects a socket that is already in a room", () => {
    const result = createRoom("s1", "dana");
    assert.equal(result.error.code, "already_in_room");
  });

  it("rejects invalid name", () => {
    assert.equal(createRoom("s2", "").error.code, "invalid_name");
    assert.equal(createRoom("s2", "     ").error.code, "invalid_name");
    assert.equal(createRoom("s2", "x".repeat(21)).error.code, "invalid_name");
    assert.equal(createRoom("s2", 123).error.code, "invalid_name");
  });
});
