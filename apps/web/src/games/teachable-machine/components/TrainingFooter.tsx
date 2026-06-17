import { Cpu } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TrainingFooterProps {
  canTrain: boolean;
  isTraining: boolean;
  onTrain: () => void;
  totalExamples: number;
}

export function TrainingFooter({
  totalExamples,
  isTraining,
  canTrain,
  onTrain,
}: TrainingFooterProps) {
  const { t } = useTranslation("gameContent");

  return (
    <div className="flex flex-col gap-3 border-white/40 border-t pt-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="rounded-xl border border-white/80 bg-white/60 px-3 py-1.5 font-bold text-[11px] text-muted shadow-xs">
        📊 {totalExamples}
      </span>

      <button
        className="big-button flex min-h-12 items-center justify-center gap-1.5 bg-gradient-to-r from-ink to-ink/90 px-5 py-2 text-white text-xs shadow-md disabled:scale-100 disabled:opacity-40"
        disabled={isTraining || !canTrain}
        onClick={onTrain}
        type="button"
      >
        <Cpu className="h-4 w-4" />
        {isTraining
          ? t("shared.buttons.trainingAi")
          : t("shared.buttons.trainAi")}
      </button>
    </div>
  );
}
