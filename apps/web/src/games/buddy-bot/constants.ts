export const DEFAULT_CHIP_IDS = [
  "what_is_ai",
  "what_is_prompt",
  "what_is_ml",
  "why_ai_wrong",
  "math_quiz",
  "fruit_example",
] as const;

export type BuddyChipId = string;

export type BuddyChipGroup =
  | "default"
  | "story"
  | "math"
  | "ai_topic"
  | "prompt_topic"
  | "fallback";
