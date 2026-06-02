import {
  CORRECT_FEEDBACK_PREFIX,
  ROUND_SIZE,
  WRONG_FEEDBACK_PREFIX,
} from "./constants";
import type { DetectiveQuestion } from "./types";

/** Legacy shuffle: same behavior as original component */
export function shuffleRound(bank: DetectiveQuestion[]): DetectiveQuestion[] {
  return [...bank].sort(() => Math.random() - 0.5).slice(0, ROUND_SIZE);
}

export function buildFeedbackText(correct: boolean, explain: string): string {
  const prefix = correct ? CORRECT_FEEDBACK_PREFIX : WRONG_FEEDBACK_PREFIX;
  return `${prefix} ${explain}`;
}

/** Matches original UI check: feedback.startsWith("Chính") */
export function isCorrectFeedback(feedback: string): boolean {
  return feedback.startsWith("Chính");
}
