import { describe, it, beforeEach } from "node:test";
import assert from "assert/strict";
import {
  clearStore,
  deleteRoom,
  getRoom,
  hasRoom,
  saveRoom,
} from "../../rooms/room.store.js";

describe("roomStore", () => {
  beforeEach(() => clearStore());

  it("saves and returns a room by code", () => {
    const room = { id: "ABC234", status: "waiting" };
    saveRoom(room);

    assert.equal(getRoom("ABC234"), room);
    assert.equal(hasRoom("ABC234"), true);
  });

  it("returns undefind for missing room", () => {
    assert.equal(getRoom("NO1234"), undefined);
  });

  it("deletes a room", () => {
    saveRoom({ id: "ABC123" });
    deleteRoom("ABC123");

    assert.equal(hasRoom("ABC123"), false);
  });
});
