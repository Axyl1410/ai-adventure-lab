import {
  COLOR_IDS,
  MOOD_IDS,
  SETTING_IDS,
  STYLE_IDS,
  SUBJECT_IDS,
  THEME_IDS,
} from "./studioData";
import type { ImageDetails } from "./types";

export const GALLERY_STORAGE_KEY = "ai-lab-images-gallery";

export const GALLERY_MAX_ITEMS = 6;

export const STICKER_ID = "artist";

export const DEFAULT_THEME = THEME_IDS[1];

export const DEFAULT_STYLE = STYLE_IDS[0];

export const DEFAULT_SUBJECT_ID = SUBJECT_IDS[0];

export const DEFAULT_SETTING_ID = SETTING_IDS[0];

export const DEFAULT_DETAILS: ImageDetails = {
  subjectId: DEFAULT_SUBJECT_ID,
  subject: "",
  settingId: DEFAULT_SETTING_ID,
  setting: "",
  colors: ["sky_blue", "yellow"],
  mood: MOOD_IDS[0],
  includeText: false,
};

export const DETAIL_COLOR_OPTIONS = COLOR_IDS;

export const GENERATE_ERROR_FALLBACK_KEY = "imageStudio.ui.generateError";
