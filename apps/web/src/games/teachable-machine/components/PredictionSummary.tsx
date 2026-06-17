import { useTranslation } from "react-i18next";

interface PredictionSummaryProps {
  emoji: string;
  name: string;
}

export function PredictionSummary({ emoji, name }: PredictionSummaryProps) {
  const { t } = useTranslation("gameContent");

  return (
    <div className="rounded-2xl border border-skyLab/20 bg-skyLab/15 p-2.5 font-bold text-[11px] text-ink leading-relaxed shadow-xs">
      🤖 {t("teachableMachine.guide.steps.step_4.title")}:{" "}
      <span className="font-black text-purple-700">
        {emoji} {name}
      </span>
      <p className="mt-0.5 font-bold text-[10px] text-muted">
        {t("teachableMachine.guide.steps.step_4.desc")}
      </p>
    </div>
  );
}
