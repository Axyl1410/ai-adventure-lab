import { AnimatePresence, motion } from "motion/react";
import { ConfettiSuccess } from "@/components/Feedback";
import { GameShell } from "@/components/GameShell";
import { useSession } from "@/hooks/useSession";
import { DetectiveFeedbackPanel } from "./components/DetectiveFeedbackPanel";
import { LevelSelectScreen } from "./components/LevelSelectScreen";
import { QuestionPrompt } from "./components/QuestionPrompt";
import { YesNoButtons } from "./components/YesNoButtons";
import { LEVEL_TITLE, ROUND_SIZE } from "./constants";
import { useAiDetectiveGame } from "./useAiDetectiveGame";

export function AiDetectiveGame() {
  const { session } = useSession();
  const game = useAiDetectiveGame(session);

  if (!game.level) {
    return (
      <GameShell
        instruction="Chọn cấp độ chơi phù hợp với em nhé!"
        subtitle="Đoán xem hoạt động nào có AI."
        title="🔍 Thám Tử AI"
      >
        <LevelSelectScreen onSelectLevel={game.selectLevel} />
      </GameShell>
    );
  }

  return (
    <GameShell
      instruction="Đọc thẻ tình huống rồi chọn Có AI hoặc Không AI."
      maxScore={game.questions.length || ROUND_SIZE}
      score={game.score}
      subtitle="Đoán xem hoạt động nào có AI."
      title={`🔍 Thám Tử AI — ${LEVEL_TITLE[game.level]}`}
    >
      <section className="lab-card relative mx-auto max-w-3xl overflow-hidden bg-white/85 p-6 text-center md:p-8">
        {game.showConfetti && <ConfettiSuccess />}
        <AnimatePresence mode="wait">
          {game.current && (
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              initial={{ opacity: 0, x: 40 }}
              key={game.index}
              transition={{ duration: 0.3 }}
            >
              <QuestionPrompt
                index={game.index}
                question={game.current}
                questionsLength={game.questions.length}
              />

              {game.feedback ? (
                <DetectiveFeedbackPanel
                  feedback={game.feedback}
                  isLastQuestion={game.isLastQuestion}
                  onClearLevel={game.clearLevel}
                  onNext={game.goNext}
                  questionsLength={game.questions.length}
                  score={game.score}
                />
              ) : (
                <YesNoButtons onSubmit={game.submitAnswer} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </GameShell>
  );
}
