import type { Level } from "../types";

interface LevelSelectScreenProps {
  onSelectLevel: (level: Level) => void;
}

export function LevelSelectScreen({ onSelectLevel }: LevelSelectScreenProps) {
  return (
    <div className="lab-card mx-auto max-w-2xl space-y-6 bg-white/80 p-8 text-center">
      <div className="mb-2 text-6xl">🪄</div>
      <h2 className="font-black text-3xl text-ink">
        Pháp sư viết câu lệnh (Prompt)
      </h2>
      <p className="font-bold text-lg text-muted">
        Prompt là câu lệnh để hướng dẫn AI làm việc cho em. Chọn cấp độ viết
        nhé:
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <button
          className="big-button bg-gradient-to-br from-greenLab to-mintLab py-4 text-ink text-lg hover:scale-103"
          onClick={() => onSelectLevel("easy")}
          type="button"
        >
          🟢 Chế độ Tập sự (Ghép 3 khối)
        </button>
        <button
          className="big-button bg-gradient-to-br from-purpleLab to-pinkLab py-4 text-lg text-white hover:scale-103"
          onClick={() => onSelectLevel("hard")}
          type="button"
        >
          🔥 Chế độ Pháp sư (Ghép 5 khối)
        </button>
      </div>
    </div>
  );
}
