import type { Ref } from "react";
import type { Answers, GroupName, Item, Level } from "../types";
import { GroupLabelButtons } from "./GroupLabelButtons";
import { ObjectDisplay } from "./ObjectDisplay";
import { ObjectNavigation } from "./ObjectNavigation";

interface LabelingCardProps {
  answers: Answers;
  contentScrollRef: Ref<HTMLDivElement>;
  current: Item | undefined;
  index: number;
  items: Item[];
  labeledCount: number;
  labelProgress: number;
  level: Level;
  onAssign: (itemLabel: string, group: GroupName, currentIndex: number) => void;
  onGoNext: () => void;
  onGoPrev: () => void;
  onGoToIndex: (index: number) => void;
}

export function LabelingCard({
  answers,
  contentScrollRef,
  current,
  index,
  items,
  labelProgress,
  labeledCount,
  level,
  onAssign,
  onGoNext,
  onGoPrev,
  onGoToIndex,
}: LabelingCardProps) {
  return (
    <div className="lab-card flex w-full flex-col rounded-3xl border border-white/60 bg-white/85 p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex shrink-0 flex-col gap-2 border-white/40 border-b pb-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-black text-muted text-sm">
          📋 Vật thể {index + 1} / {items.length}
        </span>
        <span className="w-fit rounded-2xl border border-skyLab/30 bg-skyLab/15 px-3 py-1 font-black text-ink text-xs">
          🎯 Đã gán nhãn: {labeledCount} / {items.length}
        </span>
      </div>

      {current ? (
        <>
          <ObjectDisplay
            contentScrollRef={contentScrollRef}
            current={current}
            index={index}
            level={level}
          />
          <GroupLabelButtons
            answers={answers}
            current={current}
            currentIndex={index}
            onAssign={onAssign}
          />
        </>
      ) : null}

      <ObjectNavigation
        answers={answers}
        index={index}
        items={items}
        labeledCount={labeledCount}
        labelProgress={labelProgress}
        onGoNext={onGoNext}
        onGoPrev={onGoPrev}
        onGoToIndex={onGoToIndex}
      />
    </div>
  );
}
