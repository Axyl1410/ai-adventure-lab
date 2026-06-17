import { motion } from "motion/react";
import type { Cell, Direction, PuzzleBase } from "../types";

interface GridBoardProps {
  direction: Direction;
  highlightCell: Cell | null;
  puzzle: PuzzleBase;
  robotPosition: Cell;
}

const DIRECTION_ROTATE: Record<Direction, number> = {
  north: 0,
  east: 90,
  south: 180,
  west: 270,
};

function cellKey(cell: Cell): string {
  return `${cell.x}-${cell.y}`;
}

export function GridBoard({
  puzzle,
  robotPosition,
  direction,
  highlightCell,
}: GridBoardProps) {
  const wallSet = new Set(puzzle.walls.map(cellKey));
  const cells: Cell[] = [];
  for (let y = 0; y < puzzle.gridSize; y++) {
    for (let x = 0; x < puzzle.gridSize; x++) {
      cells.push({ x, y });
    }
  }

  return (
    <div
      aria-label="Lưới đi của robot"
      className="mx-auto w-full max-w-xs"
      role="img"
    >
      <div
        className="grid gap-1.5 rounded-2xl border border-white/70 bg-cream/60 p-2 shadow-inner"
        style={{
          gridTemplateColumns: `repeat(${puzzle.gridSize}, minmax(0, 1fr))`,
        }}
      >
        {cells.map((cell) => {
          const isWall = wallSet.has(cellKey(cell));
          const isApple =
            cell.x === puzzle.apple.x && cell.y === puzzle.apple.y;
          const isRobot =
            cell.x === robotPosition.x && cell.y === robotPosition.y;
          const isHighlight =
            highlightCell !== null &&
            cell.x === highlightCell.x &&
            cell.y === highlightCell.y;

          return (
            <div
              className={`relative flex aspect-square items-center justify-center rounded-xl border text-2xl ${
                isWall
                  ? "border-ink/20 bg-ink/15"
                  : "border-white/80 bg-white/90"
              } ${isHighlight ? "ring-2 ring-yellowLab ring-offset-1" : ""}`}
              key={cellKey(cell)}
            >
              {isWall ? (
                <span aria-hidden className="text-lg">
                  🧱
                </span>
              ) : null}
              {!isWall && isApple && !isRobot ? (
                <span aria-hidden>🍎</span>
              ) : null}
              {isRobot ? (
                <motion.div
                  animate={{ rotate: DIRECTION_ROTATE[direction] }}
                  className="flex h-full w-full flex-col items-center justify-center"
                  transition={{ duration: 0.2 }}
                >
                  <span aria-hidden className="text-xl leading-none">
                    🤖
                  </span>
                  <span
                    aria-hidden
                    className="-mt-1 text-[10px] text-sky-700 leading-none"
                  >
                    ▲
                  </span>
                </motion.div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
