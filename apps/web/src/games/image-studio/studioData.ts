export const THEME_IDS = [
  "cute_animals",
  "classroom_robot",
  "planets_space",
  "rainbow_forest",
  "school_supplies",
  "fairy_tale_characters",
  "ocean_creatures",
  "friendly_future_city",
] as const;

export const STYLE_IDS = [
  "cartoon",
  "watercolor",
  "sticker",
  "classroom_poster",
  "picture_book",
  "pixel_art",
] as const;

export const SUBJECT_IDS = [
  "cat_backpack",
  "buddy_bot",
  "smiling_dolphin",
  "spaceship",
  "playful_dino",
  "cute_teddy",
] as const;

export const SETTING_IDS = [
  "rainbow_classroom",
  "starry_universe",
  "magic_forest",
  "warm_beach",
  "deep_ocean",
  "amusement_park",
] as const;

export const COLOR_IDS = [
  "sky_blue",
  "yellow",
  "pink",
  "green",
  "purple",
  "orange",
] as const;

export const MOOD_IDS = ["happy", "curious", "warm", "excited"] as const;

export type ImageThemeId = (typeof THEME_IDS)[number];
export type ImageStyleId = (typeof STYLE_IDS)[number];
export type ImageSubjectId = (typeof SUBJECT_IDS)[number];
export type ImageSettingId = (typeof SETTING_IDS)[number];
export type ImageColorId = (typeof COLOR_IDS)[number];
export type ImageMoodId = (typeof MOOD_IDS)[number];
