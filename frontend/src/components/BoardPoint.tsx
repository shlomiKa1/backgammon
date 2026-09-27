import type { Point } from "../types";

interface BoardPointProps {
  index: number;
  point: Point;
  isSelected: boolean;
  isSource: boolean;
  isDestination: boolean;
  onClick: (index: number) => void;
}

const BoardPoint = ({
  index,
  point,
  isSelected,
  isSource,
  isDestination,
  onClick,
}: BoardPointProps) => {
  const className = [
    "point",
    isSelected && "point-selected",
    isSource && "point-source",
    isDestination && "point-destination",
  ]
    .filter(Boolean)
    .join(" ");

  const clickable = isSource || isDestination || isSelected;

  return (
    <button
      className={className}
      onClick={() => onClick(index)}
      disabled={!clickable}
      aria-label={`Point ${index}`}
    >
      {point.checkers > 0 && (
        <span className={`checker checker-${point.owner}`}>
          {point.checkers}
        </span>
      )}
    </button>
  );
};

export default BoardPoint;
