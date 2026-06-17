import { useTranslation } from "react-i18next";
import type { Level } from "../types";

interface LevelSelectScreenProps {
  onSelectLevel: (level: Level) => void;
}

export function LevelSelectScreen({ onSelectLevel }: LevelSelectScreenProps) {
  const { t } = useTranslation("games");

  return (
    <div className="lab-card mx-auto max-w-2xl space-y-6 bg-white/80 p-8 text-center">
      <div className="mb-2 text-6xl">🪄</div>
      <h2 className="font-black text-3xl text-ink">{t("promptMagic.title")}</h2>
      <p className="font-bold text-lg text-muted">
        {t("promptMagic.instructionLevelSelect")}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <button
          className="big-button bg-gradient-to-br from-greenLab to-mintLab py-4 text-ink text-lg hover:scale-103"
          onClick={() => onSelectLevel("easy")}
          type="button"
        >
          🟢 {t("promptMagic.levels.easy")}
        </button>
        <button
          className="big-button bg-gradient-to-br from-purpleLab to-pinkLab py-4 text-lg text-white hover:scale-103"
          onClick={() => onSelectLevel("hard")}
          type="button"
        >
          🔥 {t("promptMagic.levels.hard")}
        </button>
      </div>
    </div>
  );
}
