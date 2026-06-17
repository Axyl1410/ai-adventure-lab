import type { TFunction } from "i18next";
import { buildFeedback } from "@/lib/gameContent";
import { ROUND_SIZE } from "./constants";

/** Legacy shuffle: same behavior as original component */
export function shuffleRound<T>(bank: T[]): T[] {
  return [...bank].sort(() => Math.random() - 0.5).slice(0, ROUND_SIZE);
}

export function buildFeedbackText(
  t: TFunction<"gameContent">,
  correct: boolean,
  explain: string
): string {
  return buildFeedback(
    t,
    correct,
    explain,
    "shared.feedback.oopsCorrect",
    "shared.feedback.oopsWrong"
  );
}
