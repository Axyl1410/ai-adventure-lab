import type { Choice } from "./types";

export const CHOICES: Choice[] = ["Nên làm", "Không nên", "Hỏi người lớn"];

export const choiceStyle: Record<Choice, { emoji: string; className: string }> =
  {
    "Nên làm": { emoji: "✅", className: "from-greenLab to-mintLab text-ink" },
    "Không nên": { emoji: "🛑", className: "from-redSoft to-pinkLab text-ink" },
    "Hỏi người lớn": {
      emoji: "🙋",
      className: "from-yellowLab to-orangeLab text-ink",
    },
  };
