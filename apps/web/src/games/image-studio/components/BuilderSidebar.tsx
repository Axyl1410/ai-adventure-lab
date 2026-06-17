import { useTranslation } from "react-i18next";
import type { ImageDetails, ImageStyleId, ImageThemeId } from "../types";
import { ImageDetailBuilder } from "./ImageDetailBuilder";
import { ImageStylePicker } from "./ImageStylePicker";
import { ImageThemePicker } from "./ImageThemePicker";

interface BuilderSidebarProps {
  details: ImageDetails;
  onDetailsChange: (value: ImageDetails) => void;
  onStyleChange: (value: ImageStyleId) => void;
  onThemeChange: (value: ImageThemeId) => void;
  style: ImageStyleId;
  theme: ImageThemeId;
}

export function BuilderSidebar({
  details,
  onDetailsChange,
  onStyleChange,
  onThemeChange,
  style,
  theme,
}: BuilderSidebarProps) {
  const { t } = useTranslation("gameContent");

  return (
    <div className="lab-card space-y-5 p-4 sm:p-5">
      <ImageThemePicker onChange={onThemeChange} value={theme} />
      <ImageStylePicker onChange={onStyleChange} value={style} />
      <div>
        <h2 className="mb-2 font-black text-xl">
          {t("imageStudio.ui.detailsHeading")}
        </h2>
        <ImageDetailBuilder details={details} setDetails={onDetailsChange} />
      </div>
    </div>
  );
}
