import type { TFunction } from "i18next";
import { buildFeedback } from "@/lib/gameContent";
import { DECK_SIZE } from "./constants";

/** Legacy shuffle: same behavior as original component */
export function shuffleDeck<T>(all: T[]): T[] {
  return [...all].sort(() => Math.random() - 0.5).slice(0, DECK_SIZE);
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
    "shared.feedback.aiSafetyCorrect",
    "shared.feedback.aiSafetyWrong"
  );
}
