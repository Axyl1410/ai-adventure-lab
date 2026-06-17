import type { TFunction } from "i18next";
import { buildFeedback } from "@/lib/gameContent";
import { DECK_SIZE } from "./constants";
import type { RecommendationRound } from "./types";

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
    "shared.feedback.aiRecommendationsCorrect",
    "shared.feedback.aiRecommendationsWrong"
  );
}

export function isCorrectOption(
  round: RecommendationRound,
  optionId: string
): boolean {
  return optionId === round.correctOptionId;
}
