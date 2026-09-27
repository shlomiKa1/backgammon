import type { Color, Point } from "../types";
import BoardPoint from "./BoardPoint";

const WHITE_TOP = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
const WHITE_BOTTOM = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

export type Source = number | "bar";
export type Target = number | "off";

interface BoardProps {
  board: Point[];
  bar: Record<Color, number>;
  borneOff: Record<Color, number>;
  yourColor: Color;
  selectedFrom: Source | null;
  sources: Set<Source>;
  destinations: Set<Target>;
  onPointClick: (index: number) => void;
  onBarClick: () => void;
  onOffClick: () => void;
}

const Board = ({
  board,
  bar,
  borneOff,
  yourColor,
  selectedFrom,
  sources,
  destinations,
  onPointClick,
  onBarClick,
  onOffClick,
}: BoardProps) => {
  const [topRow, bottomRow] =
    yourColor === "white"
      ? [WHITE_TOP, WHITE_BOTTOM]
      : [WHITE_BOTTOM, WHITE_TOP];

  const renderRow = (indexes: number[]) => (
    <div className="board-row">
      {indexes.map((index) => (
        <BoardPoint
          key={index}
          index={index}
          point={board[index]}
          isSelected={selectedFrom === index}
          isSource={sources.has(index)}
          isDestination={destinations.has(index)}
          onClick={onPointClick}
        />
      ))}
    </div>
  );

  const canEnterFromBar = sources.has("bar");
  const canBearOff = destinations.has("off");

  return (
    <section>
      {renderRow(topRow)}
      <button
        className={`board-bar ${selectedFrom === "bar" ? "point-selected" : ""}`}
        onClick={onBarClick}
        disabled={!canEnterFromBar}
      >
        Bar: white {bar.white} | black {bar.black}
      </button>

      {renderRow(bottomRow)}
      <button
        className={`board-off ${canBearOff ? "point-destination" : ""}`}
        onClick={onOffClick}
        disabled={!canBearOff}
      >
        Borne off: white {borneOff.white} | black {borneOff.black}{" "}
      </button>
    </section>
  );
};

export default Board;
