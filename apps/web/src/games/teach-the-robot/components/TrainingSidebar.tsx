import { Bot, Cpu, HelpCircle } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import {
  ConfettiSuccess,
  HappyFeedback,
  TryAgainFeedback,
} from "@/components/Feedback";
import type { Level } from "../types";

interface TrainingSidebarProps {
  level: Level;
  onResetLevel: () => void;
  onTrain: () => void;
  trained: boolean;
  training: boolean;
  weak: boolean;
}

export function TrainingSidebar({
  level,
  onResetLevel,
  onTrain,
  trained,
  training,
  weak,
}: TrainingSidebarProps) {
  const { t } = useTranslation("gameContent");
  const { t: tCommon } = useTranslation("common");

  function trainButtonLabel(): string {
    if (training) {
      return t("shared.buttons.training");
    }
    if (trained) {
      return t("shared.buttons.trained");
    }
    return t("shared.buttons.trainRobot");
  }

  return (
    <aside className="lab-card flex w-full flex-col gap-4 rounded-3xl border-white/70 bg-white/85 p-5 shadow-sm lg:max-w-[340px]">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-skyLab to-blueLab text-white shadow-md">
            <Bot className="h-6 w-6" />
          </span>
          <div>
            <h2 className="font-black text-ink text-xl tracking-tight">
              {t("teachRobot.sidebar.title")}
            </h2>
            <p className="font-bold text-muted text-xs">
              {t("teachRobot.sidebar.subtitle")}
            </p>
          </div>
        </div>

        <div className="space-y-2 rounded-2xl border border-yellowLab/20 bg-cream/60 p-4 text-xs">
          <p className="flex items-center gap-2 font-bold text-ink">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-skyLab font-black text-[10px] text-white">
              1
            </span>
            {t("teachRobot.sidebar.step1")}
          </p>
          <p className="flex items-center gap-2 font-bold text-ink">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-purpleLab font-black text-[10px] text-white">
              2
            </span>
            {t("teachRobot.levelSelect.trainPrompt")}
          </p>
          <p className="flex items-center gap-2 font-bold text-ink">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-greenLab font-black text-[10px] text-white">
              3
            </span>
            {t("teachRobot.sidebar.step3")}
          </p>
        </div>

        <button
          className="big-button flex w-full items-center justify-center gap-2 bg-gradient-to-r from-ink to-ink/90 py-3 text-base text-white shadow-md disabled:opacity-60"
          disabled={training || trained}
          onClick={onTrain}
          type="button"
        >
          <Cpu className="h-5 w-5" />
          {trainButtonLabel()}
        </button>

        {training ? (
          <div className="space-y-2">
            <p className="animate-pulse text-center font-black text-muted text-xs">
              {t("teachRobot.sidebar.trainingMessage")}
            </p>
            <div className="h-2.5 overflow-hidden rounded-full border border-white/40 bg-white/60">
              <motion.div
                animate={{ width: "100%" }}
                className="h-full rounded-full bg-gradient-to-r from-purpleLab to-skyLab"
                initial={{ width: "0%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </div>
          </div>
        ) : null}
      </div>

      {trained ? (
        <div className="relative space-y-3 border-white/60 border-t pt-3 pr-1">
          <ConfettiSuccess />
          {weak ? (
            <TryAgainFeedback text={t("shared.feedback.teachRobotWeak")} />
          ) : (
            <HappyFeedback text={t("shared.feedback.teachRobotSuccess")} />
          )}

          <div className="space-y-1 rounded-2xl border border-skyLab/20 bg-skyLab/15 p-3 shadow-xs">
            <p className="flex items-center gap-1 font-black text-[10px] text-sky-800 uppercase tracking-wider">
              <HelpCircle className="h-3.5 w-3.5" />{" "}
              {t("teachRobot.sidebar.demoPredictionTitle")}
            </p>
            <p className="font-bold text-ink text-xs leading-relaxed">
              {level === "easy"
                ? t("teachRobot.levelSelect.demoPredictionEasy")
                : t("teachRobot.levelSelect.demoPredictionHard")}
            </p>
          </div>

          <button
            className="big-button w-full border border-yellowLab/40 bg-cream py-2 font-bold text-ink text-xs"
            onClick={onResetLevel}
            type="button"
          >
            {tCommon("actions.playAgainOrLevel")}
          </button>
        </div>
      ) : null}
    </aside>
  );
}
