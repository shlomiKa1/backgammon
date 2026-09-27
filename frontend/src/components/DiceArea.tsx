interface DiceAreaProps {
  dice: number[];
  remainingDice: number[];
  canRoll: boolean;
  disabled: boolean;
  onRoll: () => void;
}

const DiceArea = ({
  dice,
  remainingDice,
  canRoll,
  disabled,
  onRoll,
}: DiceAreaProps) => {
  return (
    <section>
      <h2>Dice</h2>
      <p>
        {dice.length === 0
          ? "Not rolled yet"
          : dice.map((die, i) => <span key={`${dice.length - i}`}>{die}</span>)}
      </p>

      {remainingDice.length > 0 && (
        <p>
          Remaining: {""}
          {remainingDice.map((die, i) => (
            <span key={i}>{die}</span>
          ))}
        </p>
      )}

      {canRoll && (
        <button onClick={onRoll} disabled={disabled}>
          Roll
        </button>
      )}
    </section>
  );
};

export default DiceArea;
