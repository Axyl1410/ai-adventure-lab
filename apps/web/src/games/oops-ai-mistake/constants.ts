import type { Level } from "./types";

export const ROUND_SIZE = 5;

export const STICKER_MIN_SCORE = 3;

export const STICKER_ID = "oops";

export const CORRECT_FEEDBACK_PREFIX = "Đúng rồi!";

export const WRONG_FEEDBACK_PREFIX = "Mình kiểm tra lại nhé.";

export const LEVEL_TITLE: Record<Level, string> = {
  easy: "Logic Thực tế",
  hard: "Tin giả & Ảo tưởng",
};

export function progressGameKey(level: Level): string {
  return `oops-mistake-${level}`;
}
