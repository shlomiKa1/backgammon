import { CODE_ALPHABET, CODE_LENGTH } from "../config.js";
import { hasRoom } from "./room.store.js";

const randomIndex = () => Math.floor(Math.random() * CODE_ALPHABET.length);

export function generateRoomCode(pickIndex = randomIndex) {
  let code = "";

  while (hasRoom(code)) {
    for (let i = 0; i < CODE_LENGTH; i++) {
      code += CODE_ALPHABET[pickIndex()];
    }
  }
}
