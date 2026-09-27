import { useGameStore } from "../store/useGameStore";
import { useAction } from "../hooks/useAction";
import { rollDice } from "../socket/actions";

const DiceArea = () => {
  const game = useGameStore((state) => state.game);
  const yourColor = useGameStore((state) => state.yourColor);
  const { run, loading, error } = useAction();

  if (!game) return null;

  const canRoll = game.currentPlayer === yourColor && game.status === "waiting-for-roll";

  return (
    <section>
      <h2>Dice</h2>

      <p>{game.dice.length === 0 ? "Not rolled yet" : game.dice.join(" - ")}</p>

      {game.remainingDice.length > 0 && (
        <p>Remaining: {game.remainingDice.join(", ")}</p>
      )}

      {canRoll && (
        <button onClick={() => run(rollDice)} disabled={loading}>
          Roll
        </button>
      )}

      {error && <p>{error}</p>}
    </section>
  );
};

export default DiceArea;