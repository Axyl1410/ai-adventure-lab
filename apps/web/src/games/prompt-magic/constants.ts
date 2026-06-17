import type { BlockKey, Level } from "./types";

export const STICKER_MIN_SCORE = 80;

export const STICKER_ID = "prompt";

export const SPARKLE_DURATION_MS = 600;

export const EASY_BLOCK_KEYS: BlockKey[] = ["task", "audience", "style"];

export const LEVEL_MODE_TITLE: Record<Level, string> = {
  easy: "Tập sự",
  hard: "Pháp sư",
};
