import { styles, themes } from "./studioData";
import type { ImageDetails } from "./types";

export const GALLERY_STORAGE_KEY = "ai-lab-images-gallery";

export const GALLERY_MAX_ITEMS = 6;

export const STICKER_ID = "artist";

export const DEFAULT_THEME = themes[1];

export const DEFAULT_STYLE = styles[0];

export const DEFAULT_DETAILS: ImageDetails = {
  subject: "một chú mèo con đeo ba lô",
  setting: "trong lớp học cầu vồng",
  colors: ["xanh da trời", "vàng"],
  mood: "vui vẻ",
  includeText: false,
};

export const DETAIL_COLOR_OPTIONS = [
  "xanh da trời",
  "vàng",
  "hồng",
  "xanh lá",
  "tím",
  "cam",
];

export const GENERATE_ERROR_FALLBACK =
  "Chưa tạo được tranh. Em thử chủ đề khác nhé.";
