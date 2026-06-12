import { AnimatePresence, motion } from "motion/react";
import { ConfettiSuccess } from "@/components/Feedback";
import { GameShell } from "@/components/GameShell";
import { useSession } from "@/hooks/useSession";
import { RecommendationButtons } from "./components/RecommendationButtons";
import { RecommendationFeedbackPanel } from "./components/RecommendationFeedbackPanel";
import { RoundPrompt } from "./components/RoundPrompt";
import { DECK_SIZE, INSTRUCTION } from "./constants";
import { useAiRecommendationsGame } from "./useAiRecommendationsGame";

export function AiRecommendationsGame() {
  const { session } = useSession();
  const game = useAiRecommendationsGame(session);

  return (
    <GameShell
      instruction={INSTRUCTION}
      maxScore={game.deck.length || DECK_SIZE}
      score={game.score}
      subtitle="AI gợi ý theo mẫu đã thấy — không đọc suy nghĩ."
      title="Gợi Ý Của AI"
    >
      <section className="lab-card relative mx-auto max-w-4xl overflow-hidden bg-white/85 p-6 text-center">
        {game.done && <ConfettiSuccess />}
        <AnimatePresence mode="wait">
          {game.current && (
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              initial={{ opacity: 0, x: 30 }}
              key={game.current.id}
            >
              <RoundPrompt
                deckLength={game.deck.length}
                index={game.index}
                round={game.current}
              />

              {game.feedback ? (
                <div className="space-y-4">
                  <RecommendationFeedbackPanel
                    deckLength={game.deck.length}
                    done={game.done}
                    feedback={game.feedback}
                    isSuccess={game.isSuccessFeedback}
                    onNext={game.goNext}
                    onRestart={game.restart}
                    score={game.score}
                  />
                  {game.isSuccessFeedback ? null : (
                    <button
                      className="big-button border border-white/70 bg-white/90 font-bold text-ink"
                      onClick={game.dismissFeedback}
                      type="button"
                    >
                      Thử lại
                    </button>
                  )}
                </div>
              ) : (
                <RecommendationButtons
                  onChoose={game.submitOption}
                  options={game.current.options}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </GameShell>
  );
}
