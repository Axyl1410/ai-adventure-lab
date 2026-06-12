import { motion } from "motion/react";
import type { RecommendationOption } from "../types";

interface RecommendationButtonsProps {
  onChoose: (optionId: string) => void;
  options: RecommendationOption[];
}

export function RecommendationButtons({
  options,
  onChoose,
}: RecommendationButtonsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((option) => (
        <motion.button
          className="big-button min-h-14 border border-white/60 bg-white/95 px-4 py-3 font-bold text-base text-ink shadow-sm"
          key={option.id}
          onClick={() => onChoose(option.id)}
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span aria-hidden className="mr-2 text-xl">
            {option.emoji}
          </span>
          {option.label}
        </motion.button>
      ))}
    </div>
  );
}
