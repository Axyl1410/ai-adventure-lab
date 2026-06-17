import type { VerdictId } from "./types";

export const CHOICES: VerdictId[] = ["correct", "wrong", "needs_check"];

export const choiceStyle: Record<VerdictId, { emoji: string; color: string }> =
  {
    correct: {
      emoji: "✅",
      color: "bg-gradient-to-r from-greenLab to-mintLab text-ink",
    },
    wrong: {
      emoji: "❌",
      color: "bg-gradient-to-r from-redSoft to-pinkLab text-ink",
    },
    needs_check: {
      emoji: "🔍",
      color: "bg-gradient-to-r from-yellowLab to-orangeLab text-ink",
    },
  };
