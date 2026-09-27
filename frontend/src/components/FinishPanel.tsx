import { useGameStore } from "../store/useGameStore";
import { useAction } from "../hooks/useAction";
import { requestRematch } from "../socket/actions";

const FinishPanel = () => {
  const winner = useGameStore((state) => state.winner);
  const room = useGameStore((state) => state.room);
  const yourColor = useGameStore((state) => state.yourColor);
  const { run, loading, error } = useAction();

  if (!winner || !room || !yourColor) return null;

  const youWon = winner.winnerColor === yourColor;
  const opponentColor = yourColor === "white" ? "black" : "white";

  const iAccepted = room.rematchColors.includes(yourColor);
  const opponentAccepted = room.rematchColors.includes(opponentColor);

  return (
    <section>
      <h1>{youWon ? "You won!" : `${winner.winnerName} won`}</h1>

      {iAccepted ? (
        <p>Waiting for your opponent...</p>
      ) : (
        <button onClick={() => run(requestRematch)} disabled={loading}>
          Rematch
        </button>
      )}

      {opponentAccepted && !iAccepted && <p>Your opponent wants a rematch</p>}

      {error && <p>{error}</p>}
    </section>
  );
};

export default FinishPanel;
