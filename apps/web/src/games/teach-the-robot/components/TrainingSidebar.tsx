import { Bot, Cpu, HelpCircle } from "lucide-react";
import { motion } from "motion/react";
import {
  ConfettiSuccess,
  HappyFeedback,
  TryAgainFeedback,
} from "@/components/Feedback";
import { DEMO_PREDICTION_COPY } from "../constants";
import type { Level } from "../types";

function trainButtonLabel(training: boolean, trained: boolean): string {
  if (training) {
    return "⏳ Đang huấn luyện...";
  }
  if (trained) {
    return "✅ Đã huấn luyện";
  }
  return "🚀 Huấn luyện Robot";
}

interface TrainingSidebarProps {
  level: Level;
  onResetLevel: () => void;
  onTrain: () => void;
  trained: boolean;
  training: boolean;
  weak: boolean;
}

export function TrainingSidebar({
  level,
  onResetLevel,
  onTrain,
  trained,
  training,
  weak,
}: TrainingSidebarProps) {
  return (
    <aside className="lab-card flex w-full flex-col gap-4 rounded-3xl border-white/70 bg-white/85 p-5 shadow-sm lg:max-w-[340px]">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-skyLab to-blueLab text-white shadow-md">
            <Bot className="h-6 w-6" />
          </span>
          <div>
            <h2 className="font-black text-ink text-xl tracking-tight">
              Máy học mini
            </h2>
            <p className="font-bold text-muted text-xs">3 bước đơn giản</p>
          </div>
        </div>

        <div className="space-y-2 rounded-2xl border border-yellowLab/20 bg-cream/60 p-4 text-xs">
          <p className="flex items-center gap-2 font-bold text-ink">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-skyLab font-black text-[10px] text-white">
              1
            </span>
            Gán nhãn cho từng vật thể ở bên trái
          </p>
          <p className="flex items-center gap-2 font-bold text-ink">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-purpleLab font-black text-[10px] text-white">
              2
            </span>
            Nhấn "Huấn luyện Robot" để robot học
          </p>
          <p className="flex items-center gap-2 font-bold text-ink">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-greenLab font-black text-[10px] text-white">
              3
            </span>
            Xem robot dự đoán ví dụ mới!
          </p>
        </div>

        <button
          className="big-button flex w-full items-center justify-center gap-2 bg-gradient-to-r from-ink to-ink/90 py-3 text-base text-white shadow-md disabled:opacity-60"
          disabled={training || trained}
          onClick={onTrain}
          type="button"
        >
          <Cpu className="h-5 w-5" />
          {trainButtonLabel(training, trained)}
        </button>

        {training ? (
          <div className="space-y-2">
            <p className="animate-pulse text-center font-black text-muted text-xs">
              Robot đang học từ ví dụ của em...
            </p>
            <div className="h-2.5 overflow-hidden rounded-full border border-white/40 bg-white/60">
              <motion.div
                animate={{ width: "100%" }}
                className="h-full rounded-full bg-gradient-to-r from-purpleLab to-skyLab"
                initial={{ width: "0%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </div>
          </div>
        ) : null}
      </div>

      {trained ? (
        <div className="relative space-y-3 border-white/60 border-t pt-3 pr-1">
          <ConfettiSuccess />
          {weak ? (
            <TryAgainFeedback text="Ví dụ còn ít hoặc nhãn chưa đúng, robot có thể nhầm lẫn." />
          ) : (
            <HappyFeedback text="Tuyệt vời! Robot đã học rất tốt từ các ví dụ có nhãn của em!" />
          )}

          <div className="space-y-1 rounded-2xl border border-skyLab/20 bg-skyLab/15 p-3 shadow-xs">
            <p className="flex items-center gap-1 font-black text-[10px] text-sky-800 uppercase tracking-wider">
              <HelpCircle className="h-3.5 w-3.5" /> Robot tự đoán thử:
            </p>
            <p className="font-bold text-ink text-xs leading-relaxed">
              {DEMO_PREDICTION_COPY[level]}
            </p>
          </div>

          <button
            className="big-button w-full border border-yellowLab/40 bg-cream py-2 font-bold text-ink text-xs"
            onClick={onResetLevel}
            type="button"
          >
            🔄 Thay đổi cấp độ chơi
          </button>
        </div>
      ) : null}
    </aside>
  );
}
