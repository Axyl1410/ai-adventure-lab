import { AnimatePresence, motion } from "framer-motion";
import { ConfettiSuccess } from "../../components/Feedback";
import { GameShell } from "../../components/GameShell";
import { useSession } from "../../hooks/useSession";
import { ChoiceButtons } from "./components/ChoiceButtons";
import { QuestFeedbackPanel } from "./components/QuestFeedbackPanel";
import { ScenarioPrompt } from "./components/ScenarioPrompt";
import { DECK_SIZE } from "./constants";
import { useAiSafetyQuest } from "./useAiSafetyQuest";

export function AiSafetyQuestGame() {
  const { session } = useSession();
  const quest = useAiSafetyQuest(session);

  return (
    <GameShell
      instruction="Đọc tình huống rồi chọn hành động phù hợp: nên làm, không nên hoặc hỏi người lớn."
      maxScore={quest.deck.length || DECK_SIZE}
      score={quest.score}
      subtitle="Ra quyết định an toàn khi dùng AI."
      title="🛡️ AI Safety Quest"
    >
      <section className="lab-card relative mx-auto max-w-4xl overflow-hidden bg-white/85 p-6 text-center">
        {quest.done && <ConfettiSuccess />}
        <AnimatePresence mode="wait">
          {quest.current && (
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              initial={{ opacity: 0, x: 30 }}
              key={quest.index}
            >
              <ScenarioPrompt
                deckLength={quest.deck.length}
                index={quest.index}
                scenario={quest.current}
              />

              {quest.feedback ? (
                <QuestFeedbackPanel
                  deckLength={quest.deck.length}
                  done={quest.done}
                  feedback={quest.feedback}
                  onNext={quest.goNext}
                  onRestart={quest.restart}
                  score={quest.score}
                />
              ) : (
                <ChoiceButtons onChoose={quest.submitChoice} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </GameShell>
  );
}
