import { Play, RotateCcw, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

interface RunControlsProps {
  hasFeedback: boolean;
  onClear: () => void;
  onRun: () => void;
  onShowHint: () => void;
  running: boolean;
}

export function RunControls({
  running,
  hasFeedback,
  onRun,
  onClear,
  onShowHint,
}: RunControlsProps) {
  const { t } = useTranslation("gameContent");

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <button
        className="big-button min-h-12 bg-gradient-to-r from-greenLab to-mintLab px-5 py-3 font-black text-ink text-lg shadow-md disabled:opacity-50"
        disabled={running || hasFeedback}
        onClick={onRun}
        type="button"
      >
        <Play aria-hidden className="mr-2 inline h-5 w-5" />
        {t("shared.buttons.run")}
      </button>
      <button
        className="big-button min-h-12 border border-white/70 bg-white/90 px-4 py-3 font-bold text-ink disabled:opacity-50"
        disabled={running || hasFeedback}
        onClick={onClear}
        type="button"
      >
        <RotateCcw aria-hidden className="mr-1 inline h-4 w-4" />
        {t("shared.buttons.clearAll")}
      </button>
      <button
        className="big-button min-h-12 border border-yellowLab/50 bg-yellowLab/25 px-4 py-3 font-bold text-ink disabled:opacity-50"
        disabled={running || hasFeedback}
        onClick={onShowHint}
        type="button"
      >
        <Sparkles aria-hidden className="mr-1 inline h-4 w-4" />
        {t("shared.buttons.hint")}
      </button>
    </div>
  );
}
