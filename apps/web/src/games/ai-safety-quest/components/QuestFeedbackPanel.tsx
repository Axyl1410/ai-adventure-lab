import { Award } from "lucide-react";
import { useTranslation } from "react-i18next";
import { HappyFeedback, TryAgainFeedback } from "@/components/Feedback";

interface QuestFeedbackPanelProps {
  deckLength: number;
  done: boolean;
  feedback: string;
  feedbackCorrect: boolean;
  onNext: () => void;
  onRestart: () => void;
  score: number;
}

export function QuestFeedbackPanel({
  deckLength,
  done,
  feedback,
  feedbackCorrect,
  onNext,
  onRestart,
  score,
}: QuestFeedbackPanelProps) {
  const { t } = useTranslation("common");

  return (
    <div className="space-y-5">
      {feedbackCorrect ? (
        <HappyFeedback text={feedback} />
      ) : (
        <TryAgainFeedback text={feedback} />
      )}
      {done ? (
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 rounded-2xl bg-yellowLab/35 px-6 py-4 font-black text-ink text-xl">
            <Award className="h-7 w-7 text-orange-500" />{" "}
            {t("gameUi.completeScorePlain", { score, total: deckLength })}
          </div>
          <button
            className="big-button bg-ink text-lg text-white"
            onClick={onRestart}
            type="button"
          >
            {t("actions.playAgain")}
          </button>
        </div>
      ) : (
        <button
          className="big-button bg-ink text-lg text-white"
          onClick={onNext}
          type="button"
        >
          {t("gameUi.nextMission")}
        </button>
      )}
    </div>
  );
}
