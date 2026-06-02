import type { BlockKey, Level } from "./types";

export const STICKER_MIN_SCORE = 80;

export const STICKER_ID = "prompt";

export const SPARKLE_DURATION_MS = 600;

export const EASY_BLOCK_KEYS: BlockKey[] = ["task", "audience", "style"];

export const BLOCK_LABELS: Record<BlockKey, string> = {
  role: "👤 Vai trò (Ai đang nói?)",
  task: "🎯 Nhiệm vụ (Làm việc gì?)",
  audience: "🧒 Người nghe (Cho ai xem?)",
  style: "✨ Phong cách (Giọng điệu ra sao?)",
  format: "📋 Định dạng (Trình bày thế nào?)",
};

export const LEVEL_MODE_TITLE: Record<Level, string> = {
  easy: "Tập sự",
  hard: "Pháp sư",
};
