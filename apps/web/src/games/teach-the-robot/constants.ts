import type { Level } from "./types";

export const TRAIN_DELAY_MS = 2200;
export const AUTO_ADVANCE_MS = 500;
export const STICKER_MIN_CORRECT = 5;
export const WEAK_THRESHOLD = 4;

export const DEMO_PREDICTION_COPY: Record<Level, string> = {
  easy: "🐰 Với các ví dụ đã học, robot đoán hình mới: thỏ có tỷ lệ là Động vật rất cao!",
  hard: "🍉 Với dữ liệu phức tạp, robot dự đoán: dưa hấu có thể là Trái cây!",
};

export const LEVEL_TITLE: Record<Level, string> = {
  easy: "Cơ bản",
  hard: "Thử thách",
};
