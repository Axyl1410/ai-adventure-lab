import { MAX_EXECUTION_STEPS } from "./constants";
import type {
  Cell,
  Command,
  Direction,
  PuzzleBase,
  RunResult,
  StepSnapshot,
} from "./types";

const TURN_RIGHT: Record<Direction, Direction> = {
  north: "east",
  east: "south",
  south: "west",
  west: "north",
};

const TURN_LEFT: Record<Direction, Direction> = {
  north: "west",
  west: "south",
  south: "east",
  east: "north",
};

const FORWARD_DELTA: Record<Direction, Cell> = {
  north: { x: 0, y: -1 },
  east: { x: 1, y: 0 },
  south: { x: 0, y: 1 },
  west: { x: -1, y: 0 },
};

function cellsEqual(a: Cell, b: Cell): boolean {
  return a.x === b.x && a.y === b.y;
}

function isWall(puzzle: PuzzleBase, cell: Cell): boolean {
  if (
    cell.x < 0 ||
    cell.y < 0 ||
    cell.x >= puzzle.gridSize ||
    cell.y >= puzzle.gridSize
  ) {
    return true;
  }
  return puzzle.walls.some((wall) => cellsEqual(wall, cell));
}

function moveForward(
  position: Cell,
  direction: Direction,
  steps: number
): Cell {
  const delta = FORWARD_DELTA[direction];
  return {
    x: position.x + delta.x * steps,
    y: position.y + delta.y * steps,
  };
}

interface RunState {
  direction: Direction;
  executionCount: number;
  pickedApple: boolean;
  position: Cell;
  steps: StepSnapshot[];
}

function pushStep(
  state: RunState,
  commandIndex: number,
  command: Command
): void {
  state.steps.push({
    commandIndex,
    command,
    position: { ...state.position },
    direction: state.direction,
    pickedApple: state.pickedApple,
  });
}

function executeForward(
  state: RunState,
  puzzle: PuzzleBase,
  commandIndex: number,
  command: Command,
  stride: number
): RunResult | null {
  for (let step = 0; step < stride; step++) {
    state.executionCount += 1;
    if (state.executionCount > MAX_EXECUTION_STEPS) {
      return {
        steps: state.steps,
        outcome: "max_steps",
        failIndex: commandIndex,
      };
    }

    const next = moveForward(state.position, state.direction, 1);
    if (isWall(puzzle, next)) {
      return {
        steps: state.steps,
        outcome: "wall",
        failIndex: commandIndex,
      };
    }
    state.position = next;
    pushStep(state, commandIndex, command);
  }
  return null;
}

function finalizeRun(state: RunState, puzzle: PuzzleBase): RunResult {
  if (!state.pickedApple) {
    const endedOnApple = cellsEqual(state.position, puzzle.apple);
    return {
      steps: state.steps,
      outcome: endedOnApple ? "no_pick" : "incomplete",
    };
  }
  return { steps: state.steps, outcome: "success" };
}

export function runProgram(puzzle: PuzzleBase, commands: Command[]): RunResult {
  const state: RunState = {
    position: { ...puzzle.start },
    direction: puzzle.startDirection,
    pickedApple: false,
    steps: [],
    executionCount: 0,
  };

  for (let commandIndex = 0; commandIndex < commands.length; commandIndex++) {
    const command = commands[commandIndex];
    if (command === "turnRight") {
      state.direction = TURN_RIGHT[state.direction];
      pushStep(state, commandIndex, command);
      continue;
    }

    if (command === "turnLeft") {
      state.direction = TURN_LEFT[state.direction];
      pushStep(state, commandIndex, command);
      continue;
    }

    if (command === "forward1" || command === "forward2") {
      const stride = command === "forward1" ? 1 : 2;
      const failed = executeForward(
        state,
        puzzle,
        commandIndex,
        command,
        stride
      );
      if (failed) {
        return failed;
      }
      continue;
    }

    if (command === "pick") {
      if (cellsEqual(state.position, puzzle.apple)) {
        state.pickedApple = true;
      }
      pushStep(state, commandIndex, command);
    }
  }

  return finalizeRun(state, puzzle);
}
