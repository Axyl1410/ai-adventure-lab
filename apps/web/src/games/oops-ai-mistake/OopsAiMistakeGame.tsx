import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { ConfettiSuccess } from "@/components/Feedback";
import { GameShell } from "@/components/GameShell";
import { useSession } from "@/hooks/useSession";
import { AiClaimPrompt } from "./components/AiClaimPrompt";
import { LevelSelectScreen } from "./components/LevelSelectScreen";
import { OopsFeedbackPanel } from "./components/OopsFeedbackPanel";
import { VerdictButtons } from "./components/VerdictButtons";
import { ROUND_SIZE } from "./constants";
import { useOopsAiMistakeGame } from "./useOopsAiMistakeGame";

export function OopsAiMistakeGame() {
  const { t } = useTranslation("games");
  const { session } = useSession();
  const game = useOopsAiMistakeGame(session);

  if (!game.level) {
    return (
      <GameShell
        instruction={t("oopsAiMistake.instructionLevelSelect")}
        subtitle={t("oopsAiMistake.subtitle")}
        title={t("oopsAiMistake.title")}
      >
        <LevelSelectScreen onSelectLevel={game.selectLevel} />
      </GameShell>
    );
  }

  return (
    <GameShell
      instruction={t("oopsAiMistake.instructionPlay")}
      maxScore={game.questions.length || ROUND_SIZE}
      score={game.score}
      subtitle={t("oopsAiMistake.subtitle")}
      title={t("oopsAiMistake.titleWithLevel", {
        level: t(`oopsAiMistake.levels.${game.level}`),
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
