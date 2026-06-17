import type { CategoryId } from "./types";

export const CATEGORIES: CategoryId[] = ["good", "noisy", "private"];

export const categoryStyle: Record<
  CategoryId,
  { emoji: string; className: string }
> = {
  good: {
    emoji: "✅",
    className: "from-greenLab to-mintLab text-ink",
  },
  noisy: {
    emoji: "🧹",
    className: "from-yellowLab to-orangeLab text-ink",
  },
  private: {
    emoji: "🔒",
    className: "from-redSoft to-pinkLab text-ink",
  },
};
