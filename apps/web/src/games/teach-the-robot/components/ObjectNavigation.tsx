import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Answers, Item } from "../types";

function paginationDotClass(
  idx: number,
  activeIndex: number,
  answers: Answers,
  itemLabel: string
): string {
  if (idx === activeIndex) {
    return "h-2.5 w-8 bg-skyLab shadow-sm";
  }
  if (answers[itemLabel]) {
    return "h-2.5 w-6 bg-greenLab/80";
  }
  return "h-2.5 w-6 border border-skyLab/45 bg-skyLab/25";
}

interface ObjectNavigationProps {
  answers: Answers;
  index: number;
  items: Item[];
  labeledCount: number;
  labelProgress: number;
  onGoNext: () => void;
  onGoPrev: () => void;
  onGoToIndex: (index: number) => void;
}

export function ObjectNavigation({
  answers,
  index,
  items,
  labelProgress,
  labeledCount,
  onGoNext,
  onGoPrev,
  onGoToIndex,
}: ObjectNavigationProps) {
  return (
    <nav
      aria-label="Điều hướng vật thể"
      className="mt-4 shrink-0 border-white/40 border-t pt-4"
    >
      <div className="flex items-center gap-3">
        <button
          aria-label="Vật thể trước"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-skyLab/30 bg-white shadow-soft transition hover:bg-cream hover:shadow-md disabled:cursor-not-allowed disabled:border-white/60 disabled:opacity-40 disabled:shadow-sm"
          disabled={index === 0}
          onClick={onGoPrev}
          type="button"
        >
          <ChevronLeft className="h-6 w-6 text-skyLab" strokeWidth={2.5} />
        </button>

        <div className="min-w-0 flex-1 space-y-2 px-1">
          <p className="text-center font-black text-ink text-sm">
            Vật {index + 1} <span className="text-muted">/ {items.length}</span>
          </p>
          <div
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={labelProgress}
            className="h-2.5 overflow-hidden rounded-full border border-white/60 bg-white/90 shadow-inner"
            role="progressbar"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-skyLab to-blueLab transition-[width] duration-500 ease-out"
              style={{ width: `${labelProgress}%` }}
            />
          </div>
          <p className="text-center font-bold text-[11px] text-muted">
            {labeledCount}/{items.length} nhãn đã gán
          </p>
        </div>

        <button
          aria-label="Vật thể tiếp theo"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-skyLab/30 bg-white shadow-soft transition hover:bg-cream hover:shadow-md disabled:cursor-not-allowed disabled:border-white/60 disabled:opacity-40 disabled:shadow-sm"
          disabled={index === items.length - 1}
          onClick={onGoNext}
          type="button"
        >
          <ChevronRight className="h-6 w-6 text-skyLab" strokeWidth={2.5} />
        </button>
      </div>

      <div className="mt-3 hidden flex-wrap items-center justify-center gap-1.5 sm:flex">
        {items.map((item, idx) => (
          <button
            aria-current={idx === index ? "step" : undefined}
            aria-label={`Vật thể ${idx + 1}: ${item.label}`}
            className={`rounded-full transition-all ${paginationDotClass(idx, index, answers, item.label)}`}
            key={item.label}
            onClick={() => onGoToIndex(idx)}
            type="button"
          />
        ))}
      </div>
    </nav>
  );
}
