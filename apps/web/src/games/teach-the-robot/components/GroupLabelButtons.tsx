import { useTranslation } from "react-i18next";
import { groupLabel } from "@/lib/gameContent";
import {
  groupColors,
  groupEmojis,
  groupIdleColors,
  LABEL_GROUPS,
} from "../groupStyles";
import type { Answers, GroupId, Item } from "../types";

interface GroupLabelButtonsProps {
  answers: Answers;
  current: Item;
  currentIndex: number;
  onAssign: (itemId: string, group: GroupId, currentIndex: number) => void;
}

export function GroupLabelButtons({
  answers,
  current,
  currentIndex,
  onAssign,
}: GroupLabelButtonsProps) {
  const { t } = useTranslation("gameContent");

  return (
    <div className="mx-auto w-full max-w-lg shrink-0 overflow-visible px-1 py-2">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {LABEL_GROUPS.map((group) => {
          const isSelected = answers[current.id] === group;
          return (
            <button
              className={`big-button flex min-h-[4.5rem] flex-col items-center justify-center gap-1 border-2 px-1 py-2.5 font-semibold text-[11px] leading-tight transition-all duration-300 sm:min-h-16 sm:gap-1.5 sm:px-2 sm:py-3.5 sm:text-sm ${
                isSelected
                  ? `${groupColors[group]} font-black text-ink`
                  : `${groupIdleColors[group]} text-ink`
              }`}
              key={group}
              onClick={() => onAssign(current.id, group, currentIndex)}
              type="button"
            >
              <span className="select-none text-2xl sm:text-3xl">
                {groupEmojis[group]}
              </span>
              <span className="text-center">{groupLabel(t, group)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
