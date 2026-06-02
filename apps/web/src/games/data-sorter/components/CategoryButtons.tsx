import { motion } from "framer-motion";
import { CATEGORIES, categoryStyle } from "../categoryStyles";
import type { Category } from "../types";

interface CategoryButtonsProps {
  onChoose: (category: Category) => void;
}

export function CategoryButtons({ onChoose }: CategoryButtonsProps) {
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
            {category}
          </motion.button>
        );
      })}
    </div>
  );
}
