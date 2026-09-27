import { create } from "zustand";
import type { Color, GameFinishedEvent, GameState, PublicRoom } from "../types";

interface GameStore {
  room: PublicRoom | null;
  game: GameState | null;
  yourColor: Color | null;
  winner: GameFinishedEvent | null;
  closedReason: string | null;

  setRoom: (room: PublicRoom, yourColor: Color) => void;
  setGame: (game: GameState) => void;
  setWinner: (winner: GameFinishedEvent) => void;
  closeRoom: (reson: string) => void;
  reset: () => void;
}

const initialState = {
  room: null,
  game: null,
  yourColor: null,
  winner: null,
  closedReason: null,
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,
  setRoom: (room, yourColor) =>
    set((prev) => ({
      room,
      yourColor,
      game: room.game,
      winner: room.status === "playing" ? null : prev.winner,
    })),
  setGame: (game) => set({ game }),
  setWinner: (winner) => set({ winner }),
  closeRoom: (reson) => set({ ...initialState, closedReason: reson }),
  reset: () => set(initialState),
}));
