export const WHITE = "white";
export const BLACK = "black";

export const OPENING_LAYOUT = [
  { point: 24, count: 2 },
  { point: 13, count: 5 },
  { point: 8, count: 3 },
  { point: 6, count: 5 },
];

export const STATUS = {
  roll: "waiting-for-roll",
  move: "waiting-for-move",
  finished: "finished",
};

export const ROOM_STATUS = {
  waiting: "waiting",
  playing: "playing",
  finished: "finished",
};
export const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const CODE_LENGTH = 6;
export const MAX_NAME_LENGTH = 20;

export const PORT = process.env.PORT || 3000;
