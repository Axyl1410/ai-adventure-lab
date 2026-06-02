import { GameShell } from "../../components/GameShell";
import { useSession } from "../../hooks/useSession";
import { BlockPickerPanel } from "./components/BlockPickerPanel";
import { CoachResultPanel } from "./components/CoachResultPanel";
import { LevelSelectScreen } from "./components/LevelSelectScreen";
import { PromptPreviewPanel } from "./components/PromptPreviewPanel";
import { LEVEL_MODE_TITLE } from "./constants";
import { usePromptMagicGame } from "./usePromptMagicGame";

export function PromptMagicGame() {
  const { session } = useSession();
  const game = usePromptMagicGame(session);

  if (!game.level) {
    return (
      <GameShell
        instruction="Chọn cấp độ rèn luyện phép thuật viết câu lệnh nhé!"
        subtitle="Ghép prompt để hướng dẫn AI."
        title="Prompt Magic"
      >
        <LevelSelectScreen onSelectLevel={game.selectLevel} />
      </GameShell>
    );
  }

  return (
    <GameShell
      instruction="Chọn từng mảnh ghép bên dưới để tạo nên một câu lệnh hoàn hảo và gửi cho Prompt Coach chấm điểm nhé!"
      subtitle="Ghép prompt để hướng dẫn AI."
      title={`Prompt Magic - Chế độ ${LEVEL_MODE_TITLE[game.level]}`}
    >
      <section className="grid flex-1 gap-5 lg:grid-cols-[1fr_390px]">
        <BlockPickerPanel
          level={game.level}
          onSelectBlock={game.selectBlock}
          selected={game.selected}
        />
        <aside className="lab-card flex flex-col justify-between border-white/70 bg-white/85 p-4 sm:p-6">
          <PromptPreviewPanel
            loading={game.loading}
            onSubmit={game.submit}
            prompt={game.prompt}
            sparkle={game.sparkle}
          />
          {game.result && (
            <CoachResultPanel
              onResetLevel={game.resetLevel}
              result={game.result}
            />
          )}
        </aside>
      </section>
    </GameShell>
  );
}
