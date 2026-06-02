import { getActiveBlockEntries } from "../blockUtils";
import type { Level, SelectedBlocks } from "../types";
import { BlockCategorySection } from "./BlockCategorySection";

interface BlockPickerPanelProps {
  level: Level;
  onSelectBlock: (key: keyof SelectedBlocks, option: string) => void;
  selected: SelectedBlocks;
}

export function BlockPickerPanel({
  level,
  selected,
  onSelectBlock,
}: BlockPickerPanelProps) {
  const activeCategories = getActiveBlockEntries(level);

  return (
    <div className="lab-card grid gap-5 bg-white/70 p-4 sm:gap-6 sm:p-6">
      {activeCategories.map(([key, options]) => (
        <BlockCategorySection
          blockKey={key}
          key={key}
          onSelectBlock={onSelectBlock}
          options={options}
          selected={selected}
        />
      ))}
    </div>
  );
}
