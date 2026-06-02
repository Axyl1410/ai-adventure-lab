import { Check } from "lucide-react";

interface PickerProps {
  activeColor: string;
  items: string[];
  onChange: (value: string) => void;
  title: string;
  value: string;
}

export function Picker({
  title,
  items,
  value,
  onChange,
  activeColor,
}: PickerProps) {
  return (
    <div className="space-y-3">
      <h2 className="flex items-center gap-1.5 font-black text-ink text-xl">
        {title}
      </h2>
      <div className="flex flex-wrap gap-2.5">
        {items.map((item) => {
          const isSelected = value === item;
          return (
            <button
              className={`big-button flex items-center gap-1.5 border px-4 py-2.5 font-bold text-sm shadow-sm transition-all duration-300 hover:scale-102 ${
                isSelected
                  ? `${activeColor} shadow-md`
                  : "border-white/50 bg-white/80 text-ink hover:border-skyLab/40 hover:bg-white"
              }`}
              key={item}
              onClick={() => onChange(item)}
              type="button"
            >
              {isSelected && <Check className="h-4 w-4" />}
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}
