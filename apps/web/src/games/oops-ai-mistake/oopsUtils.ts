import {
  CORRECT_FEEDBACK_PREFIX,
  ROUND_SIZE,
  WRONG_FEEDBACK_PREFIX,
} from "./constants";
import type { OopsQuestion } from "./types";

/** Legacy shuffle: same behavior as original component */
export function shuffleRound(bank: OopsQuestion[]): OopsQuestion[] {
  return [...bank].sort(() => Math.random() - 0.5).slice(0, ROUND_SIZE);
}

export function buildFeedbackText(correct: boolean, explain: string): string {
  const prefix = correct ? CORRECT_FEEDBACK_PREFIX : WRONG_FEEDBACK_PREFIX;
  return `${prefix} ${explain}`;
}

/** Matches original UI check: feedback.startsWith("Đúng") */
export function isCorrectFeedback(feedback: string): boolean {
  return feedback.startsWith("Đúng");
}
