import { lazy, Suspense } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { BuddyBot } from "./components/BuddyBot";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";

// Lazy-load mỗi game để tách chunk, giảm bundle load lúc đầu
// tfjs chỉ load khi user vào TeachableMachineGame
const AiDetectiveGame = lazy(() =>
  import("./games/ai-detective/AiDetectiveGame").then((m) => ({
    default: m.AiDetectiveGame,
  }))
);
const TeachRobotGame = lazy(() =>
  import("./games/teach-the-robot/TeachRobotGame").then((m) => ({
    default: m.TeachRobotGame,
  }))
);
const OopsAiMistakeGame = lazy(() =>
  import("./games/oops-ai-mistake/OopsAiMistakeGame").then((m) => ({
    default: m.OopsAiMistakeGame,
  }))
);
const PromptMagicGame = lazy(() =>
  import("./games/prompt-magic/PromptMagicGame").then((m) => ({
    default: m.PromptMagicGame,
  }))
);
const BuddyBotGame = lazy(() =>
  import("./games/buddy-bot/BuddyBotGame").then((m) => ({
    default: m.BuddyBotGame,
  }))
);
const ImageStudioGame = lazy(() =>
  import("./games/image-studio/ImageStudioGame").then((m) => ({
    default: m.ImageStudioGame,
  }))
);
const TeachableMachineGame = lazy(() =>
  import("./games/teachable-machine/TeachableMachineGame").then((m) => ({
    default: m.TeachableMachineGame,
  }))
);
const DataSorterGame = lazy(() =>
  import("./games/data-sorter/DataSorterGame").then((m) => ({
    default: m.DataSorterGame,
  }))
);
const AiSafetyQuestGame = lazy(() =>
  import("./games/ai-safety-quest/AiSafetyQuestGame").then((m) => ({
    default: m.AiSafetyQuestGame,
  }))
);

function GameLoader() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <BuddyBot size={100} state="thinking" />
      <p className="animate-pulse font-black text-base text-muted">
        Đang tải trò chơi...
      </p>
    </div>
  );
}

function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-[60dvh] max-w-3xl flex-col items-center justify-center gap-5 px-6 text-center">
      <BuddyBot size={120} state="thinking" />
      <div className="lab-card bg-white/85 p-8">
        <p className="font-black text-5xl">🧭</p>
        <h1 className="mt-3 font-black text-3xl text-ink">
          Ôi, lối này chưa có trò chơi!
        </h1>
        <p className="mt-3 font-bold text-base text-muted">
          Buddy Bot chưa tìm thấy trang này. Mình quay về phòng lab để chọn hoạt
          động an toàn nhé.
        </p>
        <Link
          className="big-button mt-6 inline-flex bg-gradient-to-r from-skyLab to-purpleLab text-white shadow-md"
          to="/"
        >
          Về phòng lab
        </Link>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<HomePage />} path="/" />

        {/* Mỗi game được bọc ErrorBoundary riêng để lỗi 1 game không crash toàn app */}
        <Route
          element={
            <ErrorBoundary>
              <Suspense fallback={<GameLoader />}>
                <AiDetectiveGame />
              </Suspense>
            </ErrorBoundary>
          }
          path="/games/ai-detective"
        />
        <Route
          element={
            <ErrorBoundary>
              <Suspense fallback={<GameLoader />}>
                <TeachRobotGame />
              </Suspense>
            </ErrorBoundary>
          }
          path="/games/teach-the-robot"
        />
        <Route
          element={
            <ErrorBoundary>
              <Suspense fallback={<GameLoader />}>
                <OopsAiMistakeGame />
              </Suspense>
            </ErrorBoundary>
          }
          path="/games/oops-ai-mistake"
        />
        <Route
          element={
            <ErrorBoundary>
              <Suspense fallback={<GameLoader />}>
                <PromptMagicGame />
              </Suspense>
            </ErrorBoundary>
          }
          path="/games/prompt-magic"
        />
        <Route
          element={
            <ErrorBoundary>
              <Suspense fallback={<GameLoader />}>
                <BuddyBotGame />
              </Suspense>
            </ErrorBoundary>
          }
          path="/games/buddy-bot"
        />
        <Route
          element={
            <ErrorBoundary>
              <Suspense fallback={<GameLoader />}>
                <ImageStudioGame />
              </Suspense>
            </ErrorBoundary>
          }
          path="/games/image-studio"
        />
        <Route
          element={
            <ErrorBoundary>
              <Suspense fallback={<GameLoader />}>
                <TeachableMachineGame />
              </Suspense>
            </ErrorBoundary>
          }
          path="/games/teachable-machine"
        />
        <Route
          element={
            <ErrorBoundary>
              <Suspense fallback={<GameLoader />}>
                <DataSorterGame />
              </Suspense>
            </ErrorBoundary>
          }
          path="/games/data-sorter"
        />
        <Route
          element={
            <ErrorBoundary>
              <Suspense fallback={<GameLoader />}>
                <AiSafetyQuestGame />
              </Suspense>
            </ErrorBoundary>
          }
          path="/games/ai-safety-quest"
        />
        <Route element={<NotFoundPage />} path="*" />
      </Route>
    </Routes>
  );
}
