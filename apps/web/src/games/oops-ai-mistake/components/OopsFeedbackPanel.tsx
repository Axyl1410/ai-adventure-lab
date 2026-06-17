import { Award, BookOpen } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { HappyFeedback, TryAgainFeedback } from "@/components/Feedback";

interface OopsFeedbackPanelProps {
  feedback: string;
  feedbackCorrect: boolean;
  isLastQuestion: boolean;
  onClearLevel: () => void;
  onNext: () => void;
  questionsLength: number;
  score: number;
}

export function OopsFeedbackPanel({
  feedback,
  feedbackCorrect,
  isLastQuestion,
  onClearLevel,
  onNext,
  questionsLength,
  score,
}: OopsFeedbackPanelProps) {
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
            className="inline-flex items-center gap-3 rounded-2xl border border-yellowLab/55 bg-yellowLab/35 px-6 py-4 font-black text-ink text-lg shadow-sm"
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
          <div className="rounded-2xl border border-skyLab/20 bg-skyLab/10 p-4 text-left">
            <p className="mb-2 flex items-center gap-2 font-black text-sky-800">
              <BookOpen className="h-5 w-5" /> {t("gameUi.importantLesson")}
            </p>
            <p className="font-bold text-ink text-sm leading-relaxed">
              {t("gameUi.oopsLessonBody")}
            </p>
          </div>
          <button
            className="big-button mt-2 bg-ink text-lg text-white"
            onClick={onClearLevel}
            type="button"
          >
            {t("actions.playAgainOrLevel")}
          </button>
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
