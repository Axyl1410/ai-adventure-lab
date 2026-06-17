import { BookOpen, Download, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { TTSButton } from "@/components/TTSButton";
import { getBuddyStoryState } from "../storyPrompt";
import type { GeneratedImage } from "../types";
import { AiGeneratedLabel } from "./AiGeneratedLabel";

interface GeneratedImageCardProps {
  compact?: boolean;
  image: GeneratedImage;
  onDelete?: () => void;
  teacher?: boolean;
}

export function GeneratedImageCard({
  image,
  teacher,
  onDelete,
  compact,
}: GeneratedImageCardProps) {
  const { t } = useTranslation("gameContent");
  const navigate = useNavigate();

  function handleStory() {
    navigate("/games/buddy-bot", {
      state: getBuddyStoryState(t, image.promptUsed),
    });
  }

  return (
    <article className="lab-card space-y-3 p-4 sm:p-5">
      <div className="relative overflow-hidden rounded-2xl border border-white/30 shadow-md">
        <img
          alt={t("imageStudio.ui.generatedImageAlt")}
          className={`w-full object-cover transition-transform duration-500 hover:scale-103 ${compact ? "max-h-52" : "aspect-square"}`}
          src={image.imageUrl}
        />
        <div className="absolute bottom-3 left-3">
          <AiGeneratedLabel />
        </div>
      </div>

      {!compact && (
        <div className="space-y-1.5">
          <p className="ml-1 font-black text-muted text-xs uppercase tracking-wider">
            {t("imageStudio.ui.promptUsedLabel")}
          </p>
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <p className="flex-grow break-words rounded-2xl border border-yellowLab/20 bg-cream/60 p-3 font-bold text-ink text-sm leading-relaxed">
              {image.promptUsed}
            </p>
            <TTSButton compact={true} text={image.promptUsed} />
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <a
          className="big-button flex flex-1 items-center justify-center gap-1.5 bg-skyLab text-white hover:bg-skyLab/90"
          download={true}
          href={image.imageUrl}
        >
          <Download className="h-5 w-5" /> {t("shared.buttons.download")}
        </a>
        <button
          className="big-button flex flex-1 items-center justify-center gap-1.5 bg-purpleLab text-white hover:bg-purpleLab/90"
          onClick={handleStory}
          type="button"
        >
          <BookOpen className="h-5 w-5" /> {t("shared.buttons.tellStory")}
        </button>
        {teacher && (
          <button
            className="big-button flex items-center justify-center gap-1.5 border border-redSoft/30 bg-redSoft text-ink hover:bg-redSoft/80"
            onClick={onDelete}
            type="button"
          >
            <Trash2 className="h-5 w-5 text-red-600" />{" "}
            {t("shared.buttons.delete")}
          </button>
        )}
      </div>
    </article>
  );
}
