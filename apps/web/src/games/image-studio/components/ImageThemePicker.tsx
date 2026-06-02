import { themes } from "../studioData";
import { Picker } from "./Picker";

interface ImageThemePickerProps {
  onChange: (value: string) => void;
  value: string;
}

export function ImageThemePicker({ value, onChange }: ImageThemePickerProps) {
  return (
    <Picker
      activeColor="bg-pinkLab text-white border-pinkLab/40 hover:bg-pinkLab/90"
      items={themes}
      onChange={onChange}
      title="🎨 Chọn chủ đề tranh"
      value={value}
    />
  );
}
