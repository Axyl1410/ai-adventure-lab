import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { ConfettiSuccess } from "@/components/Feedback";
import { GameShell } from "@/components/GameShell";
import { useSession } from "@/hooks/useSession";
import { DetectiveFeedbackPanel } from "./components/DetectiveFeedbackPanel";
import { LevelSelectScreen } from "./components/LevelSelectScreen";
import { QuestionPrompt } from "./components/QuestionPrompt";
import { YesNoButtons } from "./components/YesNoButtons";
import { ROUND_SIZE } from "./constants";
import { useAiDetectiveGame } from "./useAiDetectiveGame";

export function AiDetectiveGame() {
  const { t } = useTranslation("games");
  const { session } = useSession();
  const game = useAiDetectiveGame(session);

  if (!game.level) {
    return (
      <GameShell
        instruction={t("aiDetective.instructionLevelSelect")}
        subtitle={t("aiDetective.subtitle")}
        title={t("aiDetective.title")}
      >
        <LevelSelectScreen onSelectLevel={game.selectLevel} />
      </GameShell>
    );
  }

  return (
    <GameShell
      instruction={t("aiDetective.instructionPlay")}
      maxScore={game.questions.length || ROUND_SIZE}
      score={game.score}
      subtitle={t("aiDetective.subtitle")}
      title={t("aiDetective.titleWithLevel", {
        level: t(`aiDetective.levels.${game.level}`),
      })}
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
                  feedbackCorrect={game.feedbackCorrect}
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
