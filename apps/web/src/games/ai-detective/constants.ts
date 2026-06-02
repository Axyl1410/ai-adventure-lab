import type { Level } from "./types";

export const ROUND_SIZE = 5;

export const STICKER_MIN_SCORE = 4;

export const STICKER_ID = "detective";

export const CORRECT_FEEDBACK_PREFIX = "Chính xác!";

export const WRONG_FEEDBACK_PREFIX = "Gần đúng rồi!";

export const LEVEL_TITLE: Record<Level, string> = {
  easy: "Mầm non AI",
  hard: "Thám tử Tập sự",
};

export function progressGameKey(level: Level): string {
  return `ai-detective-${level}`;
}
