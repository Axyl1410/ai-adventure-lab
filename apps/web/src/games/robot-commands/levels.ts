import type { Command, Level, Puzzle } from "./types";

const EASY_COMMANDS: Command[] = ["forward1", "turnRight", "pick"];

const HARD_COMMANDS: Command[] = [
  "forward1",
  "forward2",
  "turnRight",
  "turnLeft",
  "pick",
];

const EASY_PUZZLES: Puzzle[] = [
  {
    id: "easy-1",
    title: "Bước đầu tiên",
    gridSize: 3,
    walls: [],
    start: { x: 0, y: 2 },
    startDirection: "north",
    apple: { x: 0, y: 0 },
    starterCommands: ["forward1", "forward1"],
    maxCommands: 6,
    allowedCommands: EASY_COMMANDS,
    hintVi: "Thêm một lệnh nữa để robot nhặt táo nhé!",
  },
  {
    id: "easy-2",
    title: "Quay đúng hướng",
    gridSize: 3,
    walls: [{ x: 1, y: 1 }],
    start: { x: 0, y: 2 },
    startDirection: "north",
    apple: { x: 2, y: 0 },
    maxCommands: 6,
    allowedCommands: EASY_COMMANDS,
    hintVi:
      "Tiến lên 2 ô, quay phải một lần rồi tiến sang 2 ô và nhặt táo nhé!",
  },
  {
    id: "easy-3",
    title: "Đi vòng nhỏ",
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
    hintVi: "Robot cần quay vài lần mới tới táo.",
  },
  {
    id: "easy-4",
    title: "Hoàn thành cơ bản",
    gridSize: 3,
    walls: [{ x: 1, y: 1 }],
    start: { x: 2, y: 2 },
    startDirection: "west",
    apple: { x: 0, y: 0 },
    maxCommands: 6,
    allowedCommands: EASY_COMMANDS,
    hintVi:
      "Tiến ngang 2 ô, quay phải một lần rồi tiến lên 2 ô và nhặt táo nhé!",
  },
];

const HARD_PUZZLES: Puzzle[] = [
  {
    id: "hard-1",
    title: "Sửa một lệnh",
    gridSize: 4,
    walls: [{ x: 2, y: 2 }],
    start: { x: 0, y: 3 },
    startDirection: "north",
    apple: { x: 3, y: 0 },
    starterCommands: ["forward2", "turnRight", "forward1", "pick"],
    maxCommands: 6,
    allowedCommands: HARD_COMMANDS,
    hintVi: "Một lệnh trong dãy sẵn chưa đúng — em sửa nhé!",
  },
  {
    id: "hard-2",
    title: "Tiến hai ô",
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
    hintVi: "Đôi khi Tiến 2 ô giúp robot đi nhanh hơn.",
  },
  {
    id: "hard-3",
    title: "Hành lang",
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
    hintVi:
      "Hành lang bên phải — tiến xuống tới táo. Có thể dùng Tiến 2 ô cho nhanh!",
  },
  {
    id: "hard-4",
    title: "Thử thách cuối",
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
    hintVi:
      "Tiến ngang rồi quay phải, tiến xuống tới táo. Thử Tiến 2 ô cho gọn!",
  },
];

export function getPuzzlesForLevel(level: Level): Puzzle[] {
  return level === "easy" ? EASY_PUZZLES : HARD_PUZZLES;
}
