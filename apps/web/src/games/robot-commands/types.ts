export type Level = "easy" | "hard";

export type Direction = "north" | "east" | "south" | "west";

export type Command =
  | "forward1"
  | "forward2"
  | "turnRight"
  | "turnLeft"
  | "pick";

export interface Cell {
  x: number;
  y: number;
}

export interface Puzzle {
  allowedCommands: Command[];
  apple: Cell;
  gridSize: number;
  hintVi: string;
  id: string;
  maxCommands: number;
  start: Cell;
  startDirection: Direction;
  starterCommands?: Command[];
  title: string;
  walls: Cell[];
}

export interface StepSnapshot {
  command: Command;
  commandIndex: number;
  direction: Direction;
  pickedApple: boolean;
  position: Cell;
}

export type RunOutcome =
  | "success"
  | "wall"
  | "no_pick"
  | "max_steps"
  | "incomplete";

export interface RunResult {
  failIndex?: number;
  outcome: RunOutcome;
  steps: StepSnapshot[];
}
