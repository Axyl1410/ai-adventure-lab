import { useTranslation } from "react-i18next";
import { imageStyleLabel } from "@/lib/gameContent";
import { type ImageStyleId, STYLE_IDS } from "../studioData";
import { Picker } from "./Picker";

interface ImageStylePickerProps {
  onChange: (value: ImageStyleId) => void;
  value: ImageStyleId;
}

export function ImageStylePicker({ value, onChange }: ImageStylePickerProps) {
  const { t } = useTranslation("gameContent");
  const items = STYLE_IDS.map((id) => ({
    id,
    label: imageStyleLabel(t, id),
  }));

  return (
    <Picker
      activeColor="bg-purpleLab text-white border-purpleLab/40 hover:bg-purpleLab/90"
      items={items}
      onChange={(id) => onChange(id as ImageStyleId)}
      title={t("imageStudio.ui.stylePickerTitle")}
      value={value}
    />
  );
}
