import { useTranslation } from "react-i18next";
import { imageThemeLabel } from "@/lib/gameContent";
import { type ImageThemeId, THEME_IDS } from "../studioData";
import { Picker } from "./Picker";

interface ImageThemePickerProps {
  onChange: (value: ImageThemeId) => void;
  value: ImageThemeId;
}

export function ImageThemePicker({ value, onChange }: ImageThemePickerProps) {
  const { t } = useTranslation("gameContent");
  const items = THEME_IDS.map((id) => ({
    id,
    label: imageThemeLabel(t, id),
  }));

  return (
    <Picker
      activeColor="bg-pinkLab text-white border-pinkLab/40 hover:bg-pinkLab/90"
      items={items}
      onChange={(id) => onChange(id as ImageThemeId)}
      title={t("imageStudio.ui.themePickerTitle")}
      value={value}
    />
  );
}
