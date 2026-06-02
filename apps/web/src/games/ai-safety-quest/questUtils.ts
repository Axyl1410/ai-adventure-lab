import {
  CORRECT_FEEDBACK_PREFIX,
  DECK_SIZE,
  WRONG_FEEDBACK_PREFIX,
} from "./constants";
import type { Scenario } from "./types";

/** Legacy shuffle: same behavior as original component */
export function shuffleDeck(all: Scenario[]): Scenario[] {
  return [...all].sort(() => Math.random() - 0.5).slice(0, DECK_SIZE);
}

export function buildFeedbackText(correct: boolean, explain: string): string {
  const prefix = correct ? CORRECT_FEEDBACK_PREFIX : WRONG_FEEDBACK_PREFIX;
  return `${prefix} ${explain}`;
}

/** Matches original UI check: feedback.startsWith("Quyết") */
export function isCorrectFeedback(feedback: string): boolean {
  return feedback.startsWith("Quyết");
}
