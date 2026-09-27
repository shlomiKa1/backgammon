import type { Point } from "../types";

interface BoardPointProps {
  index: number;
  point: Point;
  top: boolean;
  canPick: boolean;
  selected: boolean;
  target: boolean;
  onClick: () => void;
}

const BoardPoint = ({
  index,
  point,
  top,
  canPick,
  selected,
  target,
  onClick,
}: BoardPointProps) => {
  let className = top ? "point point-top" : "point point-bottom";
  className += index % 2 === 0 ? " point-dark" : " point-light";
  if (canPick) className += " point-source";
  if (selected) className += " point-selected";
  if (target) className += " point-destination";

  return (
    <button className={className} onClick={onClick}>
      {point.checkers > 0 && (
        <span className={`checker checker-${point.owner}`}>
          {point.checkers}
        </span>
      )}
    </button>
  );
};

export default BoardPoint;
