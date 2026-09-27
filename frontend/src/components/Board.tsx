import { useState } from "react";
import { useGameStore } from "../store/useGameStore";
import { useAction } from "../hooks/useAction";
import { moveChecker } from "../socket/actions";
import BoardPoint from "./BoardPoint";
import "./styles/Board.css"

const WHITE_TOP = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
const WHITE_BOTTOM = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

const Board = () => {
  const game = useGameStore((state) => state.game);
  const yourColor = useGameStore((state) => state.yourColor);
  const [selected, setSelected] = useState<number | "bar" | null>(null);
  const { run, loading, error } = useAction();

  if (!game || !yourColor) return null;

  const isMyTurn = game.currentPlayer === yourColor;
  const myMoves = isMyTurn && !loading ? game.legalMoves : [];

  const canPick = (from: number | "bar") =>
    myMoves.some((m) => m.from === from);

  const findMove = (to: number | "off") =>
    myMoves.find((m) => m.from === selected && m.to === to);

  const handleClick = (spot: number | "bar" | "off") => {
    const move = spot === "bar" ? undefined : findMove(spot);
    if (move) {
      setSelected(null);
      run(() => moveChecker(move));
      return;
    }

    if (spot === selected) {
      setSelected(null);
      return;
    }

    if (spot !== "off" && canPick(spot)) setSelected(spot);
  };

  const topRow = yourColor === "white" ? WHITE_TOP : WHITE_BOTTOM;
  const bottomRow = yourColor === "white" ? WHITE_BOTTOM : WHITE_TOP;

  const renderRow = (indexes: number[], top: boolean) => (
    <div className="board-row">
      {indexes.map((index) => (
        <BoardPoint
          key={index}
          index={index}
          point={game.board[index]}
          top={top}
          canPick={canPick(index)}
          selected={selected === index}
          target={findMove(index) !== undefined}
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  );

  return (
    <section className="board">
      {renderRow(topRow, true)}

      <button
        className={
          selected === "bar" ? "board-bar point-selected" : "board-bar"
        }
        onClick={() => handleClick("bar")}
      >
        Bar: white {game.bar.white} | black {game.bar.black}
      </button>

      {renderRow(bottomRow, false)}

      <button
        className={
          findMove("off") ? "board-off point-destination" : "board-off"
        }
        onClick={() => handleClick("off")}
      >
        Borne off: white {game.borneOff.white} | black {game.borneOff.black}
      </button>

      {error && <p>{error}</p>}
    </section>
  );
};

export default Board;
