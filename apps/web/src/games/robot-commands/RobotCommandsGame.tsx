import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { ConfettiSuccess } from "@/components/Feedback";
import { GameShell } from "@/components/GameShell";
import { useSession } from "@/hooks/useSession";
import { CommandPalette } from "./components/CommandPalette";
import { CommandStrip } from "./components/CommandStrip";
import { GridBoard } from "./components/GridBoard";
import { LevelSelectScreen } from "./components/LevelSelectScreen";
import { PuzzleFeedbackPanel } from "./components/PuzzleFeedbackPanel";
import { RunControls } from "./components/RunControls";
import { useRobotCommandsGame } from "./useRobotCommandsGame";

export function RobotCommandsGame() {
  const { t } = useTranslation("games");
  const { session } = useSession();
  const game = useRobotCommandsGame(session);

  if (!game.level) {
    return (
      <GameShell
        instruction={t("robotCommands.instructionLevelSelect")}
        subtitle={t("robotCommands.subtitle")}
        title={t("robotCommands.title")}
      >
        <LevelSelectScreen onSelectLevel={game.selectLevel} />
      </GameShell>
    );
  }

  return (
    <GameShell
      instruction={t("robotCommands.instructionPlay")}
      maxScore={game.totalPuzzles}
      score={game.score}
      subtitle={t("robotCommands.subtitle")}
      title={t("robotCommands.titleWithLevel", {
        level: t(`robotCommands.levels.${game.level}`),
      })}
    >
      <section className="lab-card relative mx-auto max-w-4xl overflow-hidden bg-white/85 p-4 text-center sm:p-6">
        {game.showConfetti && <ConfettiSuccess />}
        <AnimatePresence mode="wait">
          {game.current ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              initial={{ opacity: 0, y: 16 }}
              key={game.current.id}
            >
              <p className="mb-1 font-black text-ink text-lg">
                Màn {game.puzzleIndex + 1}/{game.totalPuzzles}:{" "}
                {game.current.title}
              </p>
              <p className="mb-4 font-semibold text-muted text-sm">
                {game.current.hintVi}
              </p>

              <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
                <GridBoard
                  direction={game.direction}
                  highlightCell={game.highlightCell}
                  puzzle={game.current}
                  robotPosition={game.robotPosition}
                />

                <div className="space-y-4 text-left">
                  <CommandPalette
                    allowedCommands={game.current.allowedCommands}
                    disabled={game.running || Boolean(game.feedback)}
                    onAdd={game.addCommand}
                    sequenceFull={
                      game.sequence.length >= game.current.maxCommands
                    }
                  />
                  <CommandStrip
                    disabled={game.running || Boolean(game.feedback)}
                    failIndex={game.failIndex}
                    onMove={game.moveCommand}
                    onRemove={game.removeAt}
                    sequence={game.sequence}
                  />
                  <RunControls
                    hasFeedback={Boolean(game.feedback)}
                    onClear={game.clearSequence}
                    onRun={() => {
                      game.runSimulation().catch(() => undefined);
                    }}
                    onShowHint={game.showHint}
                    running={game.running}
                  />
                </div>
              </div>

              {game.feedback ? (
                <div className="mt-6">
                  <PuzzleFeedbackPanel
                    feedback={game.feedback}
                    isLastPuzzle={game.isLastPuzzle}
                    isSuccess={game.isSuccessFeedback}
                    onClearLevel={game.clearLevel}
                    onNext={game.goNextPuzzle}
                    score={game.score}
                    totalPuzzles={game.totalPuzzles}
                  />
                  {game.isSuccessFeedback ? null : (
                    <button
                      className="big-button mt-4 border border-white/70 bg-white/90 font-bold text-ink"
                      onClick={game.dismissFeedback}
                      type="button"
                    >
                      Thử lại
                    </button>
                  )}
                </div>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>
    </GameShell>
  );
}
