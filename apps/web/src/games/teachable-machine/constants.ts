import type { Predictions } from "./types";

export const KNN_K = 7;
export const KNN_EPSILON = 0.001;

export const FEATURE_GRID_SIZE = 16;

export const THUMBNAIL_WIDTH = 80;
export const THUMBNAIL_HEIGHT = 60;
export const THUMBNAIL_QUALITY = 0.7;

export const PREDICTION_INTERVAL_MS = 250;
export const TRAINING_STEP_MS = 600;
export const TRAINING_STEPS = 3;

export const MIN_CLASSES_TO_TRAIN = 2;

export const INITIAL_PREDICTIONS: Predictions = { 1: 0, 2: 0, 3: 0 };

export const STICKER_ID = "robot";
export const GAME_KEY = "teachable-machine";

export const GUIDE_TTS_TEXT =
  "Cẩm nang huấn luyện AI với 4 bước siêu dễ. Bước 1: Đặt tên cho 3 nhóm. Em bấm vào ô chữ ở mỗi nhóm để đặt tên nhé. Bước 2: Bật camera và chụp ảnh. Hãy chụp mỗi nhóm từ 3 đến 5 bức ảnh ở nhiều góc khác nhau. Bước 3: Huấn luyện AI. Bấm nút huấn luyện để robot học các ví dụ của em. Bước 4: Trải nghiệm dự đoán trực tiếp.";

export const STATUS_WELCOME =
  "Chào mừng em! Hãy bấm nút 'Bật Camera' để bắt đầu tự đặt tên nhóm và chụp ảnh nhé!";
