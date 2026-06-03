import { ConfettiSuccess } from "@/components/Feedback";
import { GameShell } from "@/components/GameShell";
import { useSession } from "@/hooks/useSession";
import { ClassCaptureGrid } from "./components/ClassCaptureGrid";
import { GuideBook } from "./components/GuideBook";
import { PredictionBars } from "./components/PredictionBars";
import { PredictionSummary } from "./components/PredictionSummary";
import { TrainingFooter } from "./components/TrainingFooter";
import { TrainingSidebar } from "./components/TrainingSidebar";
import { WebcamPanel } from "./components/WebcamPanel";
import { useTeachableMachineGame } from "./useTeachableMachineGame";

export function TeachableMachineGame() {
  const { session } = useSession();
  const game = useTeachableMachineGame(session);

  return (
    <GameShell
      instruction="Camera chỉ chạy cục bộ để robot học bằng ví dụ. Ảnh không gửi lên máy chủ. 🔒"
      subtitle="Tự dạy AI nhận biết hình ảnh trực tiếp trong trình duyệt."
      title="📷 Huấn Luyện AI Mini"
    >
      {game.showConfetti && <ConfettiSuccess />}
      <section className="grid flex-1 gap-4 lg:grid-cols-[1fr_340px]">
        <div className="lab-card flex flex-col justify-between rounded-3xl border border-white/60 bg-white/85 p-4 shadow-sm sm:p-5">
          <WebcamPanel
            cameraActive={game.cameraActive}
            onStart={game.startCamera}
            onStop={game.stopCamera}
            videoRef={game.videoRef}
          />
          <ClassCaptureGrid
            cameraActive={game.cameraActive}
            classes={game.classes}
            examples={game.examples}
            onCapture={game.captureExample}
            onClearClass={game.clearClassExamples}
            onDeleteExample={game.deleteExample}
            onRename={game.handleClassNameChange}
          />
          <TrainingFooter
            canTrain={game.canTrain}
            isTraining={game.isTraining}
            onTrain={game.trainModel}
            totalExamples={game.examples.length}
          />
        </div>

        <TrainingSidebar
          activeBotState={game.activeBotState}
          isTrained={game.isTrained}
          onReset={game.resetAll}
          status={game.status}
          summary={
            <PredictionSummary
              emoji={game.topPrediction.emoji}
              name={game.topPrediction.name}
            />
          }
        >
          {game.isTrained ? (
            <PredictionBars
              classes={game.classes}
              predictions={game.predictions}
            />
          ) : (
            <GuideBook />
          )}
        </TrainingSidebar>
      </section>
    </GameShell>
  );
}
