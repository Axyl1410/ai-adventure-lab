import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import detectiveBanner from "@/assets/detective-banner.png";
import type { Level } from "../types";

interface LevelSelectScreenProps {
  onSelectLevel: (level: Level) => void;
}

export function LevelSelectScreen({ onSelectLevel }: LevelSelectScreenProps) {
  const { t } = useTranslation("gameContent");

  return (
    <div className="lab-card mx-auto max-w-2xl space-y-6 bg-white/80 p-8 text-center">
      <div className="mb-2 flex max-h-48 w-full items-center justify-center overflow-hidden rounded-2xl bg-skyLab/15 shadow-md">
        <img
          alt={t("aiDetective.levelSelect.bannerAlt")}
          className="h-full max-h-48 w-full object-cover"
          src={detectiveBanner}
        />
      </div>
      <h2 className="font-black text-3xl text-ink">
        {t("aiDetective.levelSelect.title")}
      </h2>
      <p className="font-bold text-lg text-muted">
        {t("aiDetective.levelSelect.subtitle")}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <motion.button
          className="big-button bg-gradient-to-br from-greenLab to-mintLab py-4 text-ink text-lg"
          data-testid="level-easy"
          onClick={() => onSelectLevel("easy")}
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="mr-2 text-2xl">🌱</span>{" "}
          {t("aiDetective.levelSelect.easyButton")}
          <span className="mt-1 block font-semibold text-ink/60 text-xs">
            {t("aiDetective.levelSelect.easyHint")}
          </span>
        </motion.button>
        <motion.button
          className="big-button bg-gradient-to-br from-purpleLab to-pinkLab py-4 text-lg text-white"
          data-testid="level-hard"
          onClick={() => onSelectLevel("hard")}
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="mr-2 text-2xl">🔥</span>{" "}
          {t("aiDetective.levelSelect.hardButton")}
          <span className="mt-1 block font-semibold text-white/70 text-xs">
            {t("aiDetective.levelSelect.hardHint")}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
