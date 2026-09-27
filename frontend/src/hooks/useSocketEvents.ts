import { useEffect } from "react";
import { useGameStore } from "../store/useGameStore";
import type {
  GameFinishedEvent,
  GameState,
  RoomClosedEvent,
  RoomStateEvent,
} from "../types";
import { socket } from "../socket/socket";

export function useSocketEvents() {
  useEffect(() => {
    const { setRoom, setGame, setWinner, closeRoom } = useGameStore.getState();

    const onRoomState = (data: RoomStateEvent) => {
      const { yourColor, ...room } = data;
      setRoom(room, yourColor);
    };

    const onGameState = (game: GameState) => {
      setGame(game);
    };

    const onGameFinished = (winner: GameFinishedEvent) => {
      setWinner(winner);
    };

    const onRoomClosed = ({ reason }: RoomClosedEvent) => {
      closeRoom(reason);
    };

    const onDisconnect = () => {
      closeRoom("connection_lost");
    };

    socket.on("room:state", onRoomState);
    socket.on("game:state", onGameState);
    socket.on("game:finished", onGameFinished);
    socket.on("room:closed", onRoomClosed);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("room:state", onRoomState);
      socket.off("game:state", onGameState);
      socket.off("game:finished", onGameFinished);
      socket.off("game:closed", onRoomClosed);
      socket.off("disconnect", onDisconnect);
    };
  }, []);
}
