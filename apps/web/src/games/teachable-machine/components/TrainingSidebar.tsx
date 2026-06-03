import type { ReactNode } from "react";
import { BuddyBot } from "@/components/BuddyBot";
import type { BuddyBotGameState } from "../types";
import { StatusConsole } from "./StatusConsole";

interface TrainingSidebarProps {
  activeBotState: BuddyBotGameState;
  children: ReactNode;
  isTrained: boolean;
  onReset: () => void;
  status: string;
  summary?: ReactNode;
}

export function TrainingSidebar({
  activeBotState,
  status,
  isTrained,
  children,
  summary,
  onReset,
}: TrainingSidebarProps) {
  return (
    <aside className="lab-card flex flex-col justify-between rounded-3xl border-white/70 bg-white/85 p-4 shadow-sm sm:p-5">
      <div className="flex-shrink-0 space-y-3.5">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <BuddyBot size={48} state={activeBotState} />
          </div>
          <div>
            <h2 className="font-black text-ink text-lg tracking-tight">
              Máy học Trình duyệt
            </h2>
            <p className="font-bold text-[10px] text-muted uppercase tracking-wider">
              Trực quan hóa thuật toán KNN
            </p>
          </div>
        </div>

        <StatusConsole status={status} />
      </div>

      <div className="my-3 flex flex-col justify-center pr-1 lg:max-h-[430px] lg:overflow-y-auto">
        {children}
      </div>

      <div className="flex-shrink-0 space-y-2 border-white/40 border-t pt-3">
        {isTrained && summary}

        <button
          className="big-button flex w-full items-center justify-center gap-1.5 border border-yellowLab/40 bg-cream py-2 font-black text-ink text-xs shadow-xs"
          onClick={onReset}
          type="button"
        >
          🔄 Xóa hết ví dụ & Làm lại
        </button>
      </div>
    </aside>
  );
}
