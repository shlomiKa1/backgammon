export type Color = "white" | "black";
export type RoomStatus = "waiting" | "playing" | "finished";
export type GameStutas = "waiting-for-roll" | "waiting-for-move" | "finished";

export interface Point {
  owner: Color | null;
  checkers: number;
}

export interface Move {
  from: number | "bar";
  to: number | "off";
  die: number;
}

export interface GameState {
  board: Point[];
  currentPlayer: Color;
  dice: number[];
  remainingDice: number[];
  bar: Record<Color, number>;
  borneOff: Record<Color, number>;
  status: GameStutas;
  winner: Color | null;
  legalMoves: Move[];
}

export interface PublicPlayer {
  name: string;
  color: Color;
}

export interface PublicRoom {
  id: string;
  status: RoomStatus;
  players: PublicPlayer[];
  game: GameState | null;
  rematchColors: Color[];
}

export interface RoomStateEvent extends PublicRoom {
  yourColor: Color;
}

export interface ApiError {
  code: string;
  message: string;
}

export type ActionResult =
  | { success: true }
  | { success: false; error: ApiError };

export type RoomResult =
  | {
      success: true;
      room: PublicPlayer;
      yourColor: Color;
    }
  | { success: false; error: ApiError };

export interface GameFinishedEvent {
  winnerColor: Color;
  winnerName: string;
}
export interface RoomClosedEvent {
  reason: "player_left" | "player_disconnected";
}
