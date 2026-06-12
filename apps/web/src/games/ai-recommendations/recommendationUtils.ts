import {
  CORRECT_FEEDBACK_PREFIX,
  DECK_SIZE,
  WRONG_FEEDBACK_PREFIX,
} from "./constants";
import type { RecommendationRound } from "./types";

export function shuffleDeck(all: RecommendationRound[]): RecommendationRound[] {
  return [...all].sort(() => Math.random() - 0.5).slice(0, DECK_SIZE);
}

export function buildFeedbackText(correct: boolean, explain: string): string {
  const prefix = correct ? CORRECT_FEEDBACK_PREFIX : WRONG_FEEDBACK_PREFIX;
  return `${prefix} ${explain}`;
}

export function isCorrectFeedback(feedback: string): boolean {
  return feedback.startsWith(CORRECT_FEEDBACK_PREFIX);
}

export function isCorrectOption(
  round: RecommendationRound,
  optionId: string
): boolean {
  return optionId === round.correctOptionId;
}
