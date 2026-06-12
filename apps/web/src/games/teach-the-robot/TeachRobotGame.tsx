import { useTranslation } from "react-i18next";
import { GameShell } from "@/components/GameShell";
import { useSession } from "@/hooks/useSession";
import { LabelingCard } from "./components/LabelingCard";
import { LevelSelectScreen } from "./components/LevelSelectScreen";
import { TrainingSidebar } from "./components/TrainingSidebar";
import { useTeachRobotGame } from "./useTeachRobotGame";

export function TeachRobotGame() {
  const { t } = useTranslation("games");
  const { session } = useSession();
  const game = useTeachRobotGame(session);

  if (!game.level) {
    return (
      <GameShell
        instruction={t("teachRobot.instructionLevelSelect")}
        subtitle={t("teachRobot.subtitle")}
        title={t("teachRobot.title")}
      >
        <LevelSelectScreen onSelectLevel={game.selectLevel} />
      </GameShell>
    );
  }

  return (
    <GameShell
      instruction={t("teachRobot.instructionPlay")}
      maxScore={game.items.length}
      score={game.correct}
      subtitle={t("teachRobot.subtitle")}
      title={t("teachRobot.titleWithLevel", {
        level: t(`teachRobot.levels.${game.level}`),
      })}
    >
      <section className="grid flex-1 items-start gap-4 lg:grid-cols-[1fr_340px]">
        <LabelingCard
          answers={game.answers}
          contentScrollRef={game.contentScrollRef}
          current={game.current}
          index={game.index}
          items={game.items}
          labeledCount={game.labeledCount}
          labelProgress={game.labelProgress}
          level={game.level}
          onAssign={game.assignLabel}
          onGoNext={game.goNext}
          onGoPrev={game.goPrev}
          onGoToIndex={game.goToIndex}
        />
        <TrainingSidebar
          level={game.level}
          onResetLevel={game.resetLevel}
          onTrain={game.train}
          trained={game.trained}
          training={game.training}
          weak={game.weak}
        />
      </section>
    </GameShell>
  );
}
