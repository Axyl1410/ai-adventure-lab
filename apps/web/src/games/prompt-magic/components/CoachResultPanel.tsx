import { ShieldCheck, Star } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { BadgeReward } from "@/components/Feedback";
import type { PromptCoachResult } from "../types";

interface CoachResultPanelProps {
  onResetLevel: () => void;
  result: PromptCoachResult;
}

export function CoachResultPanel({
  result,
  onResetLevel,
}: CoachResultPanelProps) {
  const { t } = useTranslation("gameContent");

  return (
    <motion.div
      animate={{ scale: 1, opacity: 1 }}
      className="mt-5 space-y-4 border-white/60 border-t pt-4"
      initial={{ scale: 0.95, opacity: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <div className="flex items-center justify-between">
        <span className="font-black text-ink text-lg">
          {t("promptMagic.levelSelect.coachResultTitle")}
        </span>
        <motion.span
          animate={{ scale: [1, 1.12, 1] }}
          className="relative flex items-center gap-1.5 overflow-hidden rounded-2xl bg-purpleLab px-4 py-2 font-black text-md text-white shadow-md"
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <Star className="h-4.5 w-4.5 fill-white text-yellowLab" />{" "}
          {result.score}/100
          <span className="absolute -top-1 -right-1 animate-sparkle text-xs text-yellow-200">
            ✨
          </span>
        </motion.span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {result.badges.map((badge) => (
          <BadgeReward key={badge} text={badge} />
        ))}
      </div>

      <p className="border-purpleLab border-l-4 py-1 pl-3 font-semibold text-muted text-sm leading-relaxed">
        {result.feedback}
      </p>

      <div className="space-y-1.5 rounded-2xl border border-skyLab/20 bg-skyLab/10 p-3">
        <p className="flex items-center gap-1 font-black text-sky-800 text-xs uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4" />{" "}
          {t("promptMagic.levelSelect.improvedPromptLabel")}
        </p>
        <p className="font-bold text-ink text-sm leading-relaxed">
          "{result.improvedPrompt}"
        </p>
      </div>

      <button
        className="big-button mt-2 w-full border border-yellowLab/50 bg-cream text-ink"
        onClick={onResetLevel}
        type="button"
      >
        {t("shared.buttons.changeBlockMode")}
      </button>
    </motion.div>
  );
}
