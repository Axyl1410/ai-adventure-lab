import type { Command, Level, PuzzleBase } from "./types";

const EASY_COMMANDS: Command[] = ["forward1", "turnRight", "pick"];

const HARD_COMMANDS: Command[] = [
  "forward1",
  "forward2",
  "turnRight",
  "turnLeft",
  "pick",
];

const EASY_PUZZLES: PuzzleBase[] = [
  {
    id: "easy-1",
    gridSize: 3,
    walls: [],
    start: { x: 0, y: 2 },
    startDirection: "north",
    apple: { x: 0, y: 0 },
    starterCommands: ["forward1", "forward1"],
    maxCommands: 6,
    allowedCommands: EASY_COMMANDS,
  },
  {
    id: "easy-2",
    gridSize: 3,
    walls: [{ x: 1, y: 1 }],
    start: { x: 0, y: 2 },
    startDirection: "north",
    apple: { x: 2, y: 0 },
    maxCommands: 6,
    allowedCommands: EASY_COMMANDS,
  },
  {
    id: "easy-3",
    gridSize: 3,
    walls: [
      { x: 1, y: 0 },
      { x: 1, y: 2 },
    ],
    start: { x: 0, y: 1 },
    startDirection: "north",
    apple: { x: 2, y: 1 },
    maxCommands: 6,
    allowedCommands: EASY_COMMANDS,
  },
  {
    id: "easy-4",
    gridSize: 3,
    walls: [{ x: 1, y: 1 }],
    start: { x: 2, y: 2 },
    startDirection: "west",
    apple: { x: 0, y: 0 },
    maxCommands: 6,
    allowedCommands: EASY_COMMANDS,
  },
];

const HARD_PUZZLES: PuzzleBase[] = [
  {
    id: "hard-1",
    gridSize: 4,
    walls: [{ x: 2, y: 2 }],
    start: { x: 0, y: 3 },
    startDirection: "north",
    apple: { x: 3, y: 0 },
    starterCommands: ["forward2", "turnRight", "forward1", "pick"],
    maxCommands: 6,
    allowedCommands: HARD_COMMANDS,
  },
  {
    id: "hard-2",
    gridSize: 4,
    walls: [
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ],
    start: { x: 0, y: 3 },
    startDirection: "east",
    apple: { x: 3, y: 1 },
    maxCommands: 6,
    allowedCommands: HARD_COMMANDS,
  },
  {
    id: "hard-3",
    gridSize: 4,
    walls: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ],
    start: { x: 3, y: 0 },
    startDirection: "south",
    apple: { x: 3, y: 3 },
    maxCommands: 6,
    allowedCommands: HARD_COMMANDS,
  },
  {
    id: "hard-4",
    gridSize: 4,
    walls: [
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ],
    start: { x: 0, y: 0 },
    startDirection: "east",
    apple: { x: 3, y: 3 },
    maxCommands: 6,
    allowedCommands: HARD_COMMANDS,
  },
];

export function getPuzzlesForLevel(level: Level): PuzzleBase[] {
  return level === "easy" ? EASY_PUZZLES : HARD_PUZZLES;
}
