import { WEAK_THRESHOLD } from "./constants";
import type { Answers, Item } from "./types";

export function countCorrect(items: Item[], answers: Answers): number {
  return items.filter((item) => answers[item.id] === item.group).length;
}

export function getLabelProgress(labeledCount: number, total: number): number {
  if (total === 0) {
    return 0;
  }
  return Math.round((labeledCount / total) * 100);
}

export function isWeakModel(correct: number): boolean {
  return correct < WEAK_THRESHOLD;
}
