import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { COMMAND_LABELS } from "../constants";
import type { Command } from "../types";

interface CommandStripProps {
  disabled: boolean;
  failIndex: number | null;
  onMove: (index: number, direction: "left" | "right") => void;
  onRemove: (index: number) => void;
  sequence: Command[];
}

export function CommandStrip({
  sequence,
  disabled,
  failIndex,
  onRemove,
  onMove,
}: CommandStripProps) {
  if (sequence.length === 0) {
    return (
      <p className="rounded-2xl border border-muted/40 border-dashed bg-white/50 px-4 py-6 font-semibold text-muted text-sm">
        Chưa có lệnh nào. Em chạm các nút phía trên để xếp hàng nhé!
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="font-bold text-muted text-sm">Dãy lệnh của em</p>
      <ul className="flex flex-wrap justify-center gap-2">
        {sequence.map((command, index) => {
          const isFail = failIndex === index;
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: order edits use index controls
            <li key={`cmd-${index}`}>
              <div
                className={`flex items-center gap-1 rounded-2xl border px-2 py-1.5 font-bold text-sm shadow-sm ${
                  isFail
                    ? "border-redSoft bg-redSoft/30 text-ink"
                    : "border-white/80 bg-yellowLab/25 text-ink"
                }`}
              >
                <span className="min-w-[1.25rem] text-center text-muted text-xs">
                  {index + 1}
                </span>
                <span>{COMMAND_LABELS[command]}</span>
                <button
                  aria-label={`Đổi lệnh ${index + 1} sang trái`}
                  className="rounded-lg p-1 hover:bg-white/80 disabled:opacity-40"
                  disabled={disabled || index === 0}
                  onClick={() => onMove(index, "left")}
                  type="button"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  aria-label={`Đổi lệnh ${index + 1} sang phải`}
                  className="rounded-lg p-1 hover:bg-white/80 disabled:opacity-40"
                  disabled={disabled || index === sequence.length - 1}
                  onClick={() => onMove(index, "right")}
                  type="button"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  aria-label={`Xóa lệnh ${index + 1}`}
                  className="rounded-lg p-1 hover:bg-white/80 disabled:opacity-40"
                  disabled={disabled}
                  onClick={() => onRemove(index)}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
