import { useState } from "react";
import { useGameStore } from "../store/useGameStore";
import type { RoomResult } from "../types";
import { createRoom, joinRoom } from "../socket/actions";
import { useNavigate } from "react-router-dom";

const MAX_NAME_LENGTH = 20;
const CLOSED_REASON_TEXT: Record<string, string> = {
  player_left: "Your opponent left the room",
  player_disconnected: "Your opponent disconnected",
  connection: "Connection to the server fail",
};

const LobbyPage = () => {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const setRoom = useGameStore((state) => state.setRoom);
  const closedReason = useGameStore((state) => state.closedReason);

  const trimmedName = name.trim();
  const isValidName =
    trimmedName.length > 0 && trimmedName.length <= MAX_NAME_LENGTH;

  const submit = async (request: () => Promise<RoomResult>) => {
    setLoading(true);
    setError(null);

    const res = await request();
    setLoading(false);

    if (!res.success) {
      setError(res.error.message);
      return;
    }
    setRoom(res.room, res.yourColor);
    navigate("/waiting", {replace: true})
  };
  
  const handleCreate = () => submit(() => createRoom(trimmedName));
  const handleJoin = () => submit(() => joinRoom(roomCode, trimmedName));

  return (
    <div>
      <h1>Welcome to Backgammon</h1>
      {closedReason && (
        <p>{CLOSED_REASON_TEXT[closedReason] ?? "The room was closed"}</p>
      )}

      <input
        type="text"
        placeholder="Your name"
        value={name}
        maxLength={MAX_NAME_LENGTH}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={handleCreate} disabled={!isValidName || loading}>
        Create a new game
      </button>

      <hr />
      <input
        type="text"
        placeholder="Room code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
      />

      <button
        onClick={handleJoin}
        disabled={!isValidName || !roomCode.trim() || loading}
      >
        Join to game by code room
      </button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default LobbyPage;
