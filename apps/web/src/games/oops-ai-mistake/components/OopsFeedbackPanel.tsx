import { motion } from "framer-motion";
import { Award, BookOpen } from "lucide-react";
import { HappyFeedback, TryAgainFeedback } from "../../../components/Feedback";
import { isCorrectFeedback } from "../oopsUtils";

interface OopsFeedbackPanelProps {
  feedback: string;
  isLastQuestion: boolean;
  onClearLevel: () => void;
  onNext: () => void;
  questionsLength: number;
  score: number;
}

export function OopsFeedbackPanel({
  feedback,
  isLastQuestion,
  onClearLevel,
  onNext,
  questionsLength,
  score,
}: OopsFeedbackPanelProps) {
  return (
    <div className="space-y-5">
      {isCorrectFeedback(feedback) ? (
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
              🎉 Hoàn thành: {score}/{questionsLength} điểm!
            </span>
          </motion.div>
          <div className="rounded-2xl border border-skyLab/20 bg-skyLab/10 p-4 text-left">
            <p className="mb-2 flex items-center gap-2 font-black text-sky-800">
              <BookOpen className="h-5 w-5" /> Bài học quan trọng:
            </p>
            <p className="font-bold text-ink text-sm leading-relaxed">
              Khi AI trả lời, mình nên kiểm tra lại với thầy cô, sách hoặc nguồn
              đáng tin cậy nhé! 📚
            </p>
          </div>
          <button
            className="big-button mt-2 bg-ink text-lg text-white"
            onClick={onClearLevel}
            type="button"
          >
            🔄 Chơi lại hoặc chọn cấp độ khác
          </button>
        </div>
      ) : (
        <motion.button
          className="big-button bg-ink text-lg text-white"
          onClick={onNext}
          type="button"
          whileHover={{ scale: 1.03 }}
        >
          Câu tiếp theo ➡️
        </motion.button>
      )}
    </div>
  );
}
