import {
  ArrowRight,
  Hand,
  RotateCcw,
  RotateCw,
  SkipForward,
} from "lucide-react";
import { COMMAND_LABELS } from "../constants";
import type { Command } from "../types";

const COMMAND_ICONS: Record<Command, typeof ArrowRight> = {
  forward1: ArrowRight,
  forward2: SkipForward,
  turnRight: RotateCw,
  turnLeft: RotateCcw,
  pick: Hand,
};

interface CommandPaletteProps {
  allowedCommands: Command[];
  disabled: boolean;
  onAdd: (command: Command) => void;
  sequenceFull: boolean;
}

export function CommandPalette({
  allowedCommands,
  disabled,
  onAdd,
  sequenceFull,
}: CommandPaletteProps) {
  return (
    <div className="space-y-2">
      <p className="font-bold text-muted text-sm">Chạm để thêm lệnh</p>
      <div className="flex flex-wrap justify-center gap-2">
        {allowedCommands.map((command) => {
          const Icon = COMMAND_ICONS[command];
          return (
            <button
              className="big-button min-h-12 border border-white/70 bg-white/95 px-3 py-2 font-bold text-ink text-sm shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
              disabled={disabled || sequenceFull}
              key={command}
              onClick={() => onAdd(command)}
              type="button"
            >
              <Icon aria-hidden className="mr-1 inline h-4 w-4 text-sky-600" />
              {COMMAND_LABELS[command]}
            </button>
          );
        })}
      </div>
      {sequenceFull ? (
        <p className="font-semibold text-orange-600 text-xs">
          Đã đủ 6 lệnh. Em có thể xóa hoặc đổi chỗ trước khi thêm.
        </p>
      ) : null}
    </div>
  );
}
