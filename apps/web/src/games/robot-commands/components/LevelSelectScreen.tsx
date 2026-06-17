import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import robotLab from "@/assets/robot-lab.png";
import type { Level } from "../types";

interface LevelSelectScreenProps {
  onSelectLevel: (level: Level) => void;
}

export function LevelSelectScreen({ onSelectLevel }: LevelSelectScreenProps) {
  const { t } = useTranslation("gameContent");

  return (
    <div className="lab-card mx-auto max-w-2xl space-y-5 bg-white/80 p-6 text-center shadow-md md:p-8">
      <div className="mb-2 flex max-h-36 w-full items-center justify-center overflow-hidden rounded-2xl bg-skyLab/15 shadow-md sm:max-h-40">
        <img
          alt={t("robotCommands.levelSelect.bannerAlt")}
          className="h-full max-h-48 w-full object-cover"
          height={192}
          src={robotLab}
          width={512}
        />
      </div>
      <h2 className="font-black text-3xl text-ink">
        {t("robotCommands.levelSelect.title")}
      </h2>
      <p className="font-bold text-lg text-muted">
        {t("robotCommands.levelSelect.subtitle")}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <motion.button
          className="big-button bg-gradient-to-br from-skyLab to-blueLab py-4 text-lg text-white"
          onClick={() => onSelectLevel("easy")}
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="mr-2 text-2xl">🌱</span>{" "}
          {t("robotCommands.levelSelect.easyButton")}
          <span className="mt-1 block font-semibold text-white/80 text-xs">
            {t("robotCommands.levelSelect.easyHint")}
          </span>
        </motion.button>
        <motion.button
          className="big-button bg-gradient-to-br from-purpleLab to-pinkLab py-4 text-lg text-white"
          onClick={() => onSelectLevel("hard")}
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="mr-2 text-2xl">🔥</span>{" "}
          {t("robotCommands.levelSelect.hardButton")}
          <span className="mt-1 block font-semibold text-white/80 text-xs">
            {t("robotCommands.levelSelect.hardHint")}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
