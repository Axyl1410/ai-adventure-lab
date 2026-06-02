import type { Category } from "./types";

export const CATEGORIES: Category[] = [
  "Dữ liệu tốt",
  "Dữ liệu nhiễu",
  "Thông tin riêng tư",
];

export const categoryStyle: Record<
  Category,
  { emoji: string; className: string }
> = {
  "Dữ liệu tốt": {
    emoji: "✅",
    className: "from-greenLab to-mintLab text-ink",
  },
  "Dữ liệu nhiễu": {
    emoji: "🧹",
    className: "from-yellowLab to-orangeLab text-ink",
  },
  "Thông tin riêng tư": {
    emoji: "🔒",
    className: "from-redSoft to-pinkLab text-ink",
  },
};
