import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { verdictLabel } from "@/lib/gameContent";
import { CHOICES, choiceStyle } from "../choiceStyles";
import type { VerdictId } from "../types";

interface VerdictButtonsProps {
  onSubmit: (choice: VerdictId) => void;
}

export function VerdictButtons({ onSubmit }: VerdictButtonsProps) {
  const { t } = useTranslation("gameContent");

  return (
    <div className="grid gap-3">
      {CHOICES.map((choice) => {
        const style = choiceStyle[choice];
        return (
          <motion.button
            className={`big-button ${style.color} flex items-center justify-center gap-3 border border-white/40 py-4 text-lg shadow-sm`}
            key={choice}
            onClick={() => onSubmit(choice)}
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="text-2xl">{style.emoji}</span>{" "}
            {verdictLabel(t, choice)}
          </motion.button>
        );
      })}
    </div>
  );
}
