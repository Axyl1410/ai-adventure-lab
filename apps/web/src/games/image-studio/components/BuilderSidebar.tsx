import type { ImageDetails } from "../types";
import { ImageDetailBuilder } from "./ImageDetailBuilder";
import { ImageStylePicker } from "./ImageStylePicker";
import { ImageThemePicker } from "./ImageThemePicker";

interface BuilderSidebarProps {
  details: ImageDetails;
  onDetailsChange: (value: ImageDetails) => void;
  onStyleChange: (value: string) => void;
  onThemeChange: (value: string) => void;
  style: string;
  theme: string;
}

export function BuilderSidebar({
  details,
  onDetailsChange,
  onStyleChange,
  onThemeChange,
  style,
  theme,
}: BuilderSidebarProps) {
  return (
    <div className="lab-card space-y-5 p-4 sm:p-5">
      <ImageThemePicker onChange={onThemeChange} value={theme} />
      <ImageStylePicker onChange={onStyleChange} value={style} />
      <div>
        <h2 className="mb-2 font-black text-xl">Chi tiết</h2>
        <ImageDetailBuilder details={details} setDetails={onDetailsChange} />
      </div>
    </div>
  );
}
