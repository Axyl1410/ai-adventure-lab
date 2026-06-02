import type { Verdict } from "./types";

export const CHOICES: Verdict[] = ["Đúng", "Sai", "Cần kiểm tra thêm"];

export const choiceStyle: Record<Verdict, { emoji: string; color: string }> = {
  Đúng: {
    emoji: "✅",
    color: "bg-gradient-to-r from-greenLab to-mintLab text-ink",
  },
  Sai: {
    emoji: "❌",
    color: "bg-gradient-to-r from-redSoft to-pinkLab text-ink",
  },
  "Cần kiểm tra thêm": {
    emoji: "🔍",
    color: "bg-gradient-to-r from-yellowLab to-orangeLab text-ink",
  },
};
