import { AnimatePresence, motion } from "framer-motion";
import { ConfettiSuccess } from "../../components/Feedback";
import { GameShell } from "../../components/GameShell";
import { useSession } from "../../hooks/useSession";
import { AiClaimPrompt } from "./components/AiClaimPrompt";
import { LevelSelectScreen } from "./components/LevelSelectScreen";
import { OopsFeedbackPanel } from "./components/OopsFeedbackPanel";
import { VerdictButtons } from "./components/VerdictButtons";
import { LEVEL_TITLE, ROUND_SIZE } from "./constants";
import { useOopsAiMistakeGame } from "./useOopsAiMistakeGame";

export function OopsAiMistakeGame() {
  const { session } = useSession();
  const game = useOopsAiMistakeGame(session);

  if (!game.level) {
    return (
      <GameShell
        instruction="Chọn cấp độ chơi phù hợp với em nhé!"
        subtitle="AI không phải lúc nào cũng đúng."
        title="🤔 AI Có Thể Sai"
      >
        <LevelSelectScreen onSelectLevel={game.selectLevel} />
      </GameShell>
    );
  }

  return (
    <GameShell
      instruction="Hãy đọc câu trả lời của AI và xem có lỗi nào không nhé."
      maxScore={game.questions.length || ROUND_SIZE}
      score={game.score}
      subtitle="AI không phải lúc nào cũng đúng."
      title={`🤔 AI Có Thể Sai — ${LEVEL_TITLE[game.level]}`}
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
              <AiClaimPrompt
                index={game.index}
                question={game.current}
                questionsLength={game.questions.length}
              />

              {game.feedback ? (
                <OopsFeedbackPanel
                  feedback={game.feedback}
                  isLastQuestion={game.isLastQuestion}
                  onClearLevel={game.clearLevel}
                  onNext={game.goNext}
                  questionsLength={game.questions.length}
                  score={game.score}
                />
              ) : (
                <VerdictButtons onSubmit={game.submitChoice} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </GameShell>
  );
}
