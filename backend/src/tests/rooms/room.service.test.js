import { test, describe, it, beforeEach } from "node:test";
import assert from "assert/strict";
import {
  clearStore,
  getRoom,
  getRoomCodeBySocket,
  saveRoom,
} from "../../rooms/room.store.js";
import {
  createRoom,
  generateRoomCode,
  joinRoom,
  leaveRoom,
  toPublicRoom,
} from "../../rooms/room.service.js";
import { fixedRolls } from "../helpers.js";
import { BLACK, WHITE } from "../../config.js";

describe("room service", () => {
  beforeEach(() => clearStore());

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
      const result = createRoom("s1", "Momo");

      assert.equal(result.ok, true);
      assert.equal(result.color, WHITE);
      assert.equal(result.room.ownerSocketId, "s1");
    });

    it("rejects a socket that is already in a room", () => {
      createRoom("s1", "Momo");
      const result = createRoom("s1", "Momo");
      assert.equal(result.error.code, "already_in_room");
    });

    it("rejects invalid name", () => {
      assert.equal(createRoom("s2", "").error.code, "invalid_name");
      assert.equal(createRoom("s2", "     ").error.code, "invalid_name");
      assert.equal(createRoom("s2", "x".repeat(21)).error.code, "invalid_name");
      assert.equal(createRoom("s2", 123).error.code, "invalid_name");
    });
  });

  describe("join room", () => {
    it("adds the second player as black and normalizes the code", () => {
      const created = createRoom("s1", "Momo");
      assert.equal(created.ok, true, `Create failed: ${created.error?.code}`);
      const result = joinRoom(
        "s2",
        `   ${created.room.id.toLowerCase()}`,
        "Koko",
      );

      assert.equal(result.ok, true);
      assert.equal(result.color, BLACK);
      assert.equal(result.room.players.length, 2);
    });

    it("rejects a missing room", () => {
      assert.equal(
        joinRoom("s2", "NO1234", "Koko").error.code,
        "room_not_found",
      );
    });

    it("rejects a full room", () => {
      const { room } = createRoom("s1", "Momo");
      joinRoom("s2", room.id, "Koko");
      assert.equal(joinRoom("s3", room.id, "Toto").error.code, "room_full");
    });
  });

  describe("leave room", () => {
    it("deletes the room and returns rhe other player", () => {
      const { room } = createRoom("s1", "Momo");
      joinRoom("s2", room.id, "Koko");

      const result = leaveRoom("s1");

      assert.deepEqual(result.remainingSocketIds, ["s2"]);
      assert.equal(getRoom(room.id), undefined);
      assert.equal(getRoomCodeBySocket("s2"), undefined);
      assert.equal(createRoom("s2", "Koko").ok, true);
    });
  });

  describe("toPublicRoom", () => {
    it("never exposes socket ids", () => {
      const { room } = createRoom("s1", "Momo");
      joinRoom("s2", room.id, "Koko");

      const roomJson = JSON.stringify(toPublicRoom(room));

      assert.equal(roomJson.includes("s1"), false);
      assert.equal(roomJson.includes("socketId"), false);
    });
  });
});
