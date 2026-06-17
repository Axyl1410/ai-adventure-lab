import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  imageColorLabel,
  imageMoodLabel,
  imageSettingLabel,
  imageSettingValue,
  imageSubjectLabel,
  imageSubjectValue,
} from "@/lib/gameContent";
import { DETAIL_COLOR_OPTIONS } from "../constants";
import { MOOD_IDS, SETTING_IDS, SUBJECT_IDS } from "../studioData";
import type { ImageDetails } from "../types";
import { toggleColorSelection } from "./detailUtils";

interface ImageDetailBuilderProps {
  details: ImageDetails;
  setDetails: (value: ImageDetails) => void;
}

export function ImageDetailBuilder({
  details,
  setDetails,
}: ImageDetailBuilderProps) {
  const { t } = useTranslation("gameContent");
  const [customSubject, setCustomSubject] = useState(
    details.subjectId === "custom"
  );
  const [customSetting, setCustomSetting] = useState(
    details.settingId === "custom"
  );

  return (
    <div className="grid gap-5 rounded-3xl border border-white/50 bg-white/40 p-4 shadow-inner">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="ml-1 font-black text-muted text-sm">
            {t("imageStudio.ui.subjectLabel")}
          </label>
          <button
            className="rounded-xl border border-purpleLab/20 bg-purpleLab/10 px-2.5 py-1 font-black text-purple-600 text-xs transition-all hover:bg-purpleLab/20 focus:outline-none"
            onClick={() => setCustomSubject(!customSubject)}
            type="button"
          >
            {customSubject
              ? t("shared.buttons.quickPick")
              : t("shared.buttons.customWrite")}
          </button>
        </div>

        {customSubject ? (
          <input
            className="w-full rounded-2xl border-2 border-skyLab/20 bg-white px-4 py-3 font-semibold text-ink transition-all duration-300 hover:border-skyLab/40 focus:border-skyLab focus:outline-none focus:ring-4 focus:ring-skyLab/15"
            onChange={(e) =>
              setDetails({
                ...details,
                subjectId: "custom",
                subject: e.target.value,
              })
            }
            placeholder={t("imageStudio.ui.subjectPlaceholder")}
            value={details.subjectId === "custom" ? details.subject : ""}
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            {SUBJECT_IDS.map((subjectId) => {
              const isSelected = details.subjectId === subjectId;
              return (
                <button
                  className={`rounded-2xl border px-3.5 py-2 font-bold text-xs transition-all duration-300 focus:outline-none ${
                    isSelected
                      ? "scale-102 border-purpleLab/55 bg-purpleLab font-black text-white shadow-sm"
                      : "border-white/50 bg-white/80 text-ink hover:border-purpleLab/35 hover:bg-white"
                  }`}
                  key={subjectId}
                  onClick={() =>
                    setDetails({
                      ...details,
                      subjectId,
                      subject: imageSubjectValue(t, subjectId),
                    })
                  }
                  type="button"
                >
                  {imageSubjectLabel(t, subjectId)}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="ml-1 font-black text-muted text-sm">
            {t("imageStudio.ui.settingLabel")}
          </label>
          <button
            className="rounded-xl border border-purpleLab/20 bg-purpleLab/10 px-2.5 py-1 font-black text-purple-600 text-xs transition-all hover:bg-purpleLab/20 focus:outline-none"
            onClick={() => setCustomSetting(!customSetting)}
            type="button"
          >
            {customSetting
              ? t("shared.buttons.quickPick")
              : t("shared.buttons.customWrite")}
          </button>
        </div>

        {customSetting ? (
          <input
            className="w-full rounded-2xl border-2 border-skyLab/20 bg-white px-4 py-3 font-semibold text-ink transition-all duration-300 hover:border-skyLab/40 focus:border-skyLab focus:outline-none focus:ring-4 focus:ring-skyLab/15"
            onChange={(e) =>
              setDetails({
                ...details,
                settingId: "custom",
                setting: e.target.value,
              })
            }
            placeholder={t("imageStudio.ui.settingPlaceholder")}
            value={details.settingId === "custom" ? details.setting : ""}
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            {SETTING_IDS.map((settingId) => {
              const isSelected = details.settingId === settingId;
              return (
                <button
                  className={`rounded-2xl border px-3.5 py-2 font-bold text-xs transition-all duration-300 focus:outline-none ${
                    isSelected
                      ? "scale-102 border-pinkLab/55 bg-pinkLab font-black text-white shadow-sm"
                      : "border-white/50 bg-white/80 text-ink hover:border-pinkLab/35 hover:bg-white"
                  }`}
                  key={settingId}
                  onClick={() =>
                    setDetails({
                      ...details,
                      settingId,
                      setting: imageSettingValue(t, settingId),
                    })
                  }
                  type="button"
                >
                  {imageSettingLabel(t, settingId)}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="ml-1 font-black text-muted text-sm">
            {t("imageStudio.ui.moodLabel")}
          </label>
          <select
            className="w-full rounded-2xl border-2 border-skyLab/20 px-4 py-3 font-bold text-ink transition-all duration-300 hover:border-skyLab/40 focus:border-skyLab focus:outline-none focus:ring-4 focus:ring-skyLab/15"
            onChange={(e) =>
              setDetails({
                ...details,
                mood: e.target.value as ImageDetails["mood"],
              })
            }
            value={details.mood}
          >
            {MOOD_IDS.map((moodId) => (
              <option key={moodId} value={moodId}>
                {imageMoodLabel(t, moodId)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="ml-1 font-black text-muted text-sm">
            {t("imageStudio.ui.includeTextLabel")}
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/60 bg-white p-3 font-bold text-ink transition-colors hover:bg-cream/40">
            <input
              checked={details.includeText}
              className="h-5 w-5 rounded-md border-skyLab text-purpleLab focus:ring-purpleLab"
              onChange={(e) =>
                setDetails({ ...details, includeText: e.target.checked })
              }
              type="checkbox"
            />
            <span>{t("imageStudio.ui.includeTextCheckbox")}</span>
          </label>
        </div>
      </div>

      <div className="mt-1 space-y-2">
        <label className="ml-1 font-black text-muted text-sm">
          {t("imageStudio.ui.colorsLabel")}
        </label>
        <div className="flex flex-wrap gap-2">
          {DETAIL_COLOR_OPTIONS.map((colorId) => {
            const isSelected = details.colors.includes(colorId);
            const label = imageColorLabel(t, colorId);
            return (
              <button
                className={`rounded-full border px-4 py-2 font-bold text-sm shadow-xs transition-all duration-300 ${
                  isSelected
                    ? "scale-105 border-yellowLab/50 bg-yellowLab text-ink"
                    : "border-white/40 bg-white text-muted hover:border-skyLab/30"
                }`}
                key={colorId}
                onClick={() =>
                  setDetails({
                    ...details,
                    colors: toggleColorSelection(details.colors, colorId),
                  })
                }
                type="button"
              >
                {isSelected ? `✓ ${label}` : label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
