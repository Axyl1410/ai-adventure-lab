import { Award } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { HappyFeedback, TryAgainFeedback } from "@/components/Feedback";

interface DetectiveFeedbackPanelProps {
  feedback: string;
  feedbackCorrect: boolean;
  isLastQuestion: boolean;
  onClearLevel: () => void;
  onNext: () => void;
  questionsLength: number;
  score: number;
}

export function DetectiveFeedbackPanel({
  feedback,
  feedbackCorrect,
  isLastQuestion,
  onClearLevel,
  onNext,
  questionsLength,
  score,
}: DetectiveFeedbackPanelProps) {
  const { t } = useTranslation("common");

  return (
    <div className="space-y-5">
      {feedbackCorrect ? (
        <HappyFeedback text={feedback} />
      ) : (
        <TryAgainFeedback text={feedback} />
      )}
      {isLastQuestion ? (
        <div className="space-y-4 pt-3">
          <motion.div
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-3 rounded-2xl border border-yellowLab/55 bg-yellowLab/35 px-6 py-4 font-black text-ink text-xl shadow-sm"
            initial={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Award className="h-7 w-7 fill-orange-200 text-orange-500" />
            <span>
              {t("gameUi.completeScore", {
                score,
                total: questionsLength,
              })}
            </span>
          </motion.div>
          <div>
            <button
              className="big-button mt-2 bg-ink text-lg text-white"
              onClick={onClearLevel}
              type="button"
            >
              {t("actions.playAgainOrLevel")}
            </button>
          </div>
        </div>
      ) : (
        <motion.button
          className="big-button bg-ink text-lg text-white"
          onClick={onNext}
          type="button"
          whileHover={{ scale: 1.03 }}
        >
          {t("actions.nextQuestion")}
        </motion.button>
      )}
    </div>
  );
}
