import { useState } from "react";
import { DETAIL_COLOR_OPTIONS } from "../constants";
import { suggestedSettings, suggestedSubjects } from "../studioData";
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
  const [customSubject, setCustomSubject] = useState(false);
  const [customSetting, setCustomSetting] = useState(false);

  return (
    <div className="grid gap-5 rounded-3xl border border-white/50 bg-white/40 p-4 shadow-inner">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="ml-1 font-black text-muted text-sm">
            Vẽ ai hoặc cái gì?
          </label>
          <button
            className="rounded-xl border border-purpleLab/20 bg-purpleLab/10 px-2.5 py-1 font-black text-purple-600 text-xs transition-all hover:bg-purpleLab/20 focus:outline-none"
            onClick={() => setCustomSubject(!customSubject)}
            type="button"
          >
            {customSubject ? "📋 Chọn nhanh" : "✏️ Em tự viết"}
          </button>
        </div>

        {customSubject ? (
          <input
            className="w-full rounded-2xl border-2 border-skyLab/20 bg-white px-4 py-3 font-semibold text-ink transition-all duration-300 hover:border-skyLab/40 focus:border-skyLab focus:outline-none focus:ring-4 focus:ring-skyLab/15"
            onChange={(e) =>
              setDetails({ ...details, subject: e.target.value })
            }
            placeholder="Ví dụ: một chú mèo con đeo ba lô"
            value={details.subject}
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            {suggestedSubjects.map((sub) => {
              const isSelected = details.subject === sub.value;
              return (
                <button
                  className={`rounded-2xl border px-3.5 py-2 font-bold text-xs transition-all duration-300 focus:outline-none ${
                    isSelected
                      ? "scale-102 border-purpleLab/55 bg-purpleLab font-black text-white shadow-sm"
                      : "border-white/50 bg-white/80 text-ink hover:border-purpleLab/35 hover:bg-white"
                  }`}
                  key={sub.value}
                  onClick={() => setDetails({ ...details, subject: sub.value })}
                  type="button"
                >
                  {sub.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="ml-1 font-black text-muted text-sm">
            Ở đâu? (Bối cảnh)
          </label>
          <button
            className="rounded-xl border border-purpleLab/20 bg-purpleLab/10 px-2.5 py-1 font-black text-purple-600 text-xs transition-all hover:bg-purpleLab/20 focus:outline-none"
            onClick={() => setCustomSetting(!customSetting)}
            type="button"
          >
            {customSetting ? "📋 Chọn nhanh" : "✏️ Em tự viết"}
          </button>
        </div>

        {customSetting ? (
          <input
            className="w-full rounded-2xl border-2 border-skyLab/20 bg-white px-4 py-3 font-semibold text-ink transition-all duration-300 hover:border-skyLab/40 focus:border-skyLab focus:outline-none focus:ring-4 focus:ring-skyLab/15"
            onChange={(e) =>
              setDetails({ ...details, setting: e.target.value })
            }
            placeholder="Ví dụ: trong khu vườn hoa lấp lánh"
            value={details.setting}
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            {suggestedSettings.map((set) => {
              const isSelected = details.setting === set.value;
              return (
                <button
                  className={`rounded-2xl border px-3.5 py-2 font-bold text-xs transition-all duration-300 focus:outline-none ${
                    isSelected
                      ? "scale-102 border-pinkLab/55 bg-pinkLab font-black text-white shadow-sm"
                      : "border-white/50 bg-white/80 text-ink hover:border-pinkLab/35 hover:bg-white"
                  }`}
                  key={set.value}
                  onClick={() => setDetails({ ...details, setting: set.value })}
                  type="button"
                >
                  {set.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="ml-1 font-black text-muted text-sm">
            Cảm xúc tranh
          </label>
          <select
            className="w-full rounded-2xl border-2 border-skyLab/20 px-4 py-3 font-bold text-ink transition-all duration-300 hover:border-skyLab/40 focus:border-skyLab focus:outline-none focus:ring-4 focus:ring-skyLab/15"
            onChange={(e) => setDetails({ ...details, mood: e.target.value })}
            value={details.mood}
          >
            <option>vui vẻ</option>
            <option>tò mò</option>
            <option>ấm áp</option>
            <option>hào hứng</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="ml-1 font-black text-muted text-sm">
            Có chữ ngắn
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
            <span>Thêm chữ ngắn</span>
          </label>
        </div>
      </div>

      <div className="mt-1 space-y-2">
        <label className="ml-1 font-black text-muted text-sm">
          🎨 Chọn các màu sắc chính:
        </label>
        <div className="flex flex-wrap gap-2">
          {DETAIL_COLOR_OPTIONS.map((color) => {
            const isSelected = details.colors.includes(color);
            return (
              <button
                className={`rounded-full border px-4 py-2 font-bold text-sm shadow-xs transition-all duration-300 ${
                  isSelected
                    ? "scale-105 border-yellowLab/50 bg-yellowLab text-ink"
                    : "border-white/40 bg-white text-muted hover:border-skyLab/30"
                }`}
                key={color}
                onClick={() =>
                  setDetails({
                    ...details,
                    colors: toggleColorSelection(details.colors, color),
                  })
                }
                type="button"
              >
                {isSelected ? `✓ ${color}` : color}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
