import type { Color, GameFinishedEvent } from "../types";

interface FinishPanelProps {
  winner: GameFinishedEvent;
  yourColor: Color;
  rematchColors: Color[];
  disabled: boolean;
  onRematch: () => void;
}

const FinishPanel = ({
  winner,
  yourColor,
  rematchColors,
  disabled,
  onRematch,
}: FinishPanelProps) => {
  const youWon = winner.winnerColor === yourColor;
  const opponentColor: Color = yourColor === "white" ? "black" : "white";
  const hasAccepted = rematchColors.includes(yourColor);

  const opponentAccepted = rematchColors.includes(opponentColor);

  return (
    <section>
      <h1>{youWon ? `You Won!` : `${winner.winnerName} won`}</h1>

      {hasAccepted ? (
        <p>Waiting for your opponent...</p>
      ) : (
        <button onClick={onRematch} disabled={disabled}>
          Rematch
        </button>
      )}

      {opponentAccepted && hasAccepted && <p>Your opponent wants a rematch</p>}
    </section>
  );
};

export default FinishPanel;
