import { useNavigate } from "react-router-dom";
import { useGameStore } from "../store/useGameStore";
import { useState } from "react";
import { leaveRoom, startGame } from "../socket/actions";

const WaitingRoomPage = () => {
  const room = useGameStore((state) => state.room);
  const yourColor = useGameStore((state) => state.yourColor);
  const reset = useGameStore((state) => state.reset);

  const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
  if (!room) return null;

  const isOwner = yourColor === "white";
  const isFull = room.players.length === 2;

  const handleStart = async () => {
    setError(null);
    const res = await startGame();
    if (!res.success) setError(res.error.message);
    navigate("/game", { replace: true });
  };

  const handleLeave = async () => {
    await leaveRoom();
    reset();
    navigate("/", { replace: true });
  };

  return (
    <div>
      <h1>Room {room.id}</h1>
      <p>Share this code with your opponent</p>

      <ul>
        {room.players.map((player) => (
          <li key={player.color}>
            {player.name} ({player.color})
            {player.color === yourColor && " - you"}
          </li>
        ))}
      </ul>

      {!isFull && <p>Waiting for an opponent...</p>}

      {isOwner ? (
        <button onClick={handleStart} disabled={!isFull}>Start Game</button>
      ) : (
        <p>Waiting for the host to start the game</p>
      )}
      <button onClick={handleLeave}>Leave room</button>

      {error && <p>{error}</p>}
    </div>
  );
};

export default WaitingRoomPage;
