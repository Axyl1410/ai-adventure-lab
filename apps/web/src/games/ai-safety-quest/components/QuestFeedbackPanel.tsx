import { Award } from "lucide-react";
import { HappyFeedback, TryAgainFeedback } from "../../../components/Feedback";
import { isCorrectFeedback } from "../questUtils";

interface QuestFeedbackPanelProps {
  deckLength: number;
  done: boolean;
  feedback: string;
  onNext: () => void;
  onRestart: () => void;
  score: number;
}

export function QuestFeedbackPanel({
  deckLength,
  done,
  feedback,
  onNext,
  onRestart,
  score,
}: QuestFeedbackPanelProps) {
  return (
    <div className="space-y-5">
      {isCorrectFeedback(feedback) ? (
        <HappyFeedback text={feedback} />
      ) : (
        <TryAgainFeedback text={feedback} />
      )}
      {done ? (
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 rounded-2xl bg-yellowLab/35 px-6 py-4 font-black text-ink text-xl">
            <Award className="h-7 w-7 text-orange-500" /> Hoàn thành: {score}/
            {deckLength} điểm!
          </div>
          <button
            className="big-button bg-ink text-lg text-white"
            onClick={onRestart}
            type="button"
          >
            🔄 Chơi lại
          </button>
        </div>
      ) : (
        <button
          className="big-button bg-ink text-lg text-white"
          onClick={onNext}
          type="button"
        >
          Nhiệm vụ tiếp theo ➡️
        </button>
      )}
    </div>
  );
}
