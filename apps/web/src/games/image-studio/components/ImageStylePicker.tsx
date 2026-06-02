import { styles } from "../studioData";
import { Picker } from "./Picker";

interface ImageStylePickerProps {
  onChange: (value: string) => void;
  value: string;
}

export function ImageStylePicker({ value, onChange }: ImageStylePickerProps) {
  return (
    <Picker
      activeColor="bg-purpleLab text-white border-purpleLab/40 hover:bg-purpleLab/90"
      items={styles}
      onChange={onChange}
      title="✨ Chọn phong cách vẽ"
      value={value}
    />
  );
}
