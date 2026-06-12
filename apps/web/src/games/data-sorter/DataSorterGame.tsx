import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { ConfettiSuccess } from "@/components/Feedback";
import { GameShell } from "@/components/GameShell";
import { useSession } from "@/hooks/useSession";
import { CardPrompt } from "./components/CardPrompt";
import { CategoryButtons } from "./components/CategoryButtons";
import { SorterFeedbackPanel } from "./components/SorterFeedbackPanel";
import { DECK_SIZE } from "./constants";
import { useDataSorterGame } from "./useDataSorterGame";

export function DataSorterGame() {
  const { t } = useTranslation("games");
  const { session } = useSession();
  const sorter = useDataSorterGame(session);

  return (
    <GameShell
      instruction={t("dataSorter.instruction")}
      maxScore={sorter.deck.length || DECK_SIZE}
      score={sorter.score}
      subtitle={t("dataSorter.subtitle")}
      title={t("dataSorter.title")}
    >
      <section className="lab-card relative mx-auto max-w-4xl overflow-hidden bg-white/85 p-6 text-center">
        {sorter.done && <ConfettiSuccess />}
        <AnimatePresence mode="wait">
          {sorter.current && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              initial={{ opacity: 0, y: 24 }}
              key={sorter.index}
            >
              <CardPrompt
                card={sorter.current}
                deckLength={sorter.deck.length}
                index={sorter.index}
              />

              {sorter.feedback ? (
                <SorterFeedbackPanel
                  deckLength={sorter.deck.length}
                  done={sorter.done}
                  feedback={sorter.feedback}
                  onNext={sorter.goNext}
                  onRestart={sorter.restart}
                  score={sorter.score}
                />
              ) : (
                <CategoryButtons onChoose={sorter.submitCategory} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </GameShell>
  );
}
