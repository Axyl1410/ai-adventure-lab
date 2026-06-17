import type { ChoiceId } from "./types";

export const CHOICES: ChoiceId[] = ["do_it", "dont", "ask_adult"];

export const choiceStyle: Record<
  ChoiceId,
  { emoji: string; className: string }
> = {
  do_it: { emoji: "✅", className: "from-greenLab to-mintLab text-ink" },
  dont: { emoji: "🛑", className: "from-redSoft to-pinkLab text-ink" },
  ask_adult: {
    emoji: "🙋",
    className: "from-yellowLab to-orangeLab text-ink",
  },
};
