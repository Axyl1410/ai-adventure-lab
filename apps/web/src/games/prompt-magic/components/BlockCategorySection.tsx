import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { BlockKey, SelectedBlocks } from "../types";

interface BlockCategorySectionProps {
  blockKey: BlockKey;
  onSelectBlock: (key: BlockKey, option: string) => void;
  options: string[];
  selected: SelectedBlocks;
}

export function BlockCategorySection({
  blockKey,
  options,
  selected,
  onSelectBlock,
}: BlockCategorySectionProps) {
  const { t } = useTranslation("gameContent");

  return (
    <div className="space-y-3">
      <h2 className="flex items-center gap-1.5 border-white/50 border-b pb-1.5 font-black text-ink text-lg">
        {t(`promptMagic.blockLabels.${blockKey}`)}
      </h2>
      <div className="flex flex-wrap gap-3">
        {options.map((blockId) => {
          const isSelected = selected[blockKey] === blockId;
          const label = t(`promptMagic.blocks.${blockKey}.${blockId}`);
          return (
            <button
              className={`big-button flex w-full items-center justify-center gap-2 border-2 px-4 py-3 font-bold text-sm transition-all duration-300 hover:scale-[1.03] hover:shadow-md sm:w-auto sm:px-5 sm:text-base ${
                isSelected
                  ? "scale-[1.03] border-yellowLab bg-yellowLab font-black text-ink shadow-md ring-2 ring-yellowLab/40"
                  : "border-skyLab/35 bg-cream/90 text-ink shadow-sm hover:border-skyLab/55 hover:bg-white"
              }`}
              key={blockId}
              onClick={() => onSelectBlock(blockKey, blockId)}
              type="button"
            >
              {isSelected && (
                <Check className="h-5 w-5 stroke-[3px] text-ink" />
              )}
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
