import type { Command, Level } from "./types";

export const PROGRESS_GAME_KEY = "robot-commands";

export const PUZZLES_PER_LEVEL = 4;

export const MAX_SEQUENCE_LENGTH = 6;

export const MAX_EXECUTION_STEPS = 24;

export const STEP_ANIMATION_MS = 320;

export const STICKER_MIN_SCORE = 3;

export const STICKER_ID = "commander";

export const LEVEL_TITLE: Record<Level, string> = {
  easy: "Cơ bản",
  hard: "Thử thách",
};

export const COMMAND_LABELS: Record<Command, string> = {
  forward1: "Tiến 1 ô",
  forward2: "Tiến 2 ô",
  turnRight: "Quay phải",
  turnLeft: "Quay trái",
  pick: "Nhặt táo",
};

export const INSTRUCTION =
  "Chạm lệnh để xếp hàng. Bấm Chạy thử xem Buddy Bot đi từng bước nhé!";

export const SUCCESS_FEEDBACK =
  "Robot làm đúng từng bước — không phải đoán ma thuật đâu!";

export function wallFeedback(stepNumber: number): string {
  return `Ồ! Bước thứ ${stepNumber} chưa đúng. Em thử đổi thứ tự hoặc thêm lệnh quay nhé!`;
}

export const NO_PICK_FEEDBACK =
  "Robot chưa nhặt được táo. Em thử thêm lệnh Nhặt táo khi đứng đúng ô nhé!";

export const INCOMPLETE_FEEDBACK =
  "Chưa xong đâu! Em cần robot đến ô táo và nhặt táo nhé.";
