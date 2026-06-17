import type { Level, OopsQuestionBase } from "./types";

export const easyQuestions: OopsQuestionBase[] = [
  { id: "fish_on_tree", answer: "wrong" },
  { id: "sun_rises_east", answer: "correct" },
  { id: "dog_with_wings", answer: "wrong" },
  { id: "blue_ripe_banana", answer: "wrong" },
  { id: "cat_eight_legs", answer: "wrong" },
  { id: "rainbow_seven_colors", answer: "correct" },
  { id: "bread_grows_in_field", answer: "wrong" },
  { id: "water_boil_10c", answer: "wrong" },
  { id: "apple_colors", answer: "correct" },
  { id: "chicken_fish_eggs", answer: "wrong" },
];

export const hardQuestions: OopsQuestionBase[] = [
  { id: "all_birds_fly", answer: "needs_check" },
  { id: "ai_always_correct", answer: "wrong" },
  { id: "all_photos_real", answer: "needs_check" },
  { id: "robot_has_emotions", answer: "wrong" },
  { id: "humans_on_mars_1969", answer: "wrong" },
  { id: "all_liquid_sweet", answer: "wrong" },
  { id: "ocean_blue_ink", answer: "wrong" },
  { id: "ai_six_fingers", answer: "correct" },
  { id: "t_rex_amazon", answer: "wrong" },
  { id: "astronaut_horse_mars", answer: "needs_check" },
  { id: "ai_medicine_no_doctor", answer: "wrong" },
];

export function getQuestionBank(level: Level): OopsQuestionBase[] {
  return level === "easy" ? easyQuestions : hardQuestions;
}
