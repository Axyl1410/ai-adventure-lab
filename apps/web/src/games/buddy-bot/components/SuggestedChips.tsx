import type { BuddyChip } from "../types";

interface SuggestedChipsProps {
  chips: BuddyChip[];
  onChipClick: (chip: BuddyChip) => void;
}

export function SuggestedChips({ chips, onChipClick }: SuggestedChipsProps) {
  return (
    <div className="mb-3 flex snap-x gap-2.5 overflow-x-auto pb-1 sm:mb-4 sm:flex-wrap sm:overflow-visible sm:pb-0">
      {chips.map((chip) => (
        <button
          className="min-h-11 shrink-0 snap-start rounded-full border border-yellowLab/25 bg-cream/80 px-4 py-2.5 font-bold text-ink text-sm shadow-xs transition-all duration-300 hover:scale-[1.03] hover:border-yellowLab/40 hover:bg-yellowLab/20"
          key={chip.id}
          onClick={() => onChipClick(chip)}
          type="button"
        >
          {chip.text}
        </button>
      ))}
    </div>
  );
}
