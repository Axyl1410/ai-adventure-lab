import { Award } from "lucide-react";
import { motion } from "motion/react";
import { HappyFeedback, TryAgainFeedback } from "../../../components/Feedback";

interface PuzzleFeedbackPanelProps {
  feedback: string;
  isLastPuzzle: boolean;
  isSuccess: boolean;
  onClearLevel: () => void;
  onNext: () => void;
  score: number;
  totalPuzzles: number;
}

export function PuzzleFeedbackPanel({
  feedback,
  isSuccess,
  isLastPuzzle,
  onNext,
  onClearLevel,
  score,
  totalPuzzles,
}: PuzzleFeedbackPanelProps) {
  return (
    <div className="space-y-5">
      {isSuccess ? (
        <HappyFeedback text={feedback} />
      ) : (
        <TryAgainFeedback text={feedback} />
      )}
      {isSuccess && isLastPuzzle ? (
        <div className="space-y-4 pt-3">
          <motion.div
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-3 rounded-2xl border border-yellowLab/55 bg-yellowLab/35 px-6 py-4 font-black text-ink text-xl shadow-sm"
            initial={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Award className="h-7 w-7 fill-orange-200 text-orange-500" />
            <span>
              Hoàn thành: {score}/{totalPuzzles} điểm!
            </span>
          </motion.div>
          <button
            className="big-button bg-ink text-lg text-white"
            onClick={onClearLevel}
            type="button"
          >
            Chơi lại hoặc chọn cấp độ khác
          </button>
        </div>
      ) : null}
      {isSuccess && !isLastPuzzle ? (
        <motion.button
          className="big-button bg-ink text-lg text-white"
          onClick={onNext}
          type="button"
          whileHover={{ scale: 1.03 }}
        >
          Màn tiếp theo
        </motion.button>
      ) : null}
    </div>
  );
}
