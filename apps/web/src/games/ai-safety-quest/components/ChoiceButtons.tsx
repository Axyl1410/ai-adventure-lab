import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { choiceLabel } from "@/lib/gameContent";
import { CHOICES, choiceStyle } from "../choiceStyles";
import type { ChoiceId } from "../types";

interface ChoiceButtonsProps {
  onChoose: (choice: ChoiceId) => void;
}

export function ChoiceButtons({ onChoose }: ChoiceButtonsProps) {
  const { t } = useTranslation("gameContent");

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {CHOICES.map((choice) => {
        const style = choiceStyle[choice];
        return (
          <motion.button
            className={`big-button bg-gradient-to-r ${style.className} border border-white/40 py-4 text-lg shadow-sm`}
            key={choice}
            onClick={() => onChoose(choice)}
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="mr-2 text-2xl">{style.emoji}</span>
            {choiceLabel(t, choice)}
          </motion.button>
        );
      })}
    </div>
  );
}
