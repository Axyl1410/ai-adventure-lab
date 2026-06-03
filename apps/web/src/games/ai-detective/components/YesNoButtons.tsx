import { motion } from "motion/react";

interface YesNoButtonsProps {
  onSubmit: (hasAi: boolean) => void;
}

export function YesNoButtons({ onSubmit }: YesNoButtonsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <motion.button
        className="big-button flex items-center justify-center gap-2 bg-gradient-to-r from-greenLab to-mintLab py-4 text-ink text-lg shadow-sm"
        onClick={() => onSubmit(true)}
        type="button"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
      >
        <span className="text-2xl">🤖</span> Có AI
      </motion.button>
      <motion.button
        className="big-button flex items-center justify-center gap-2 bg-gradient-to-r from-blueLab to-skyLab py-4 text-lg text-white shadow-sm"
        onClick={() => onSubmit(false)}
        type="button"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
      >
        <span className="text-2xl">🔌</span> Không AI
      </motion.button>
    </div>
  );
}
