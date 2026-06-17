import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { categoryLabel } from "@/lib/gameContent";
import { CATEGORIES, categoryStyle } from "../categoryStyles";
import type { CategoryId } from "../types";

interface CategoryButtonsProps {
  onChoose: (category: CategoryId) => void;
}

export function CategoryButtons({ onChoose }: CategoryButtonsProps) {
  const { t } = useTranslation("gameContent");

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {CATEGORIES.map((category) => {
        const style = categoryStyle[category];
        return (
          <motion.button
            className={`big-button bg-gradient-to-r ${style.className} border border-white/40 py-4 text-lg shadow-sm`}
            key={category}
            onClick={() => onChoose(category)}
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="mr-2 text-2xl">{style.emoji}</span>
            {categoryLabel(t, category)}
          </motion.button>
        );
      })}
    </div>
  );
}
