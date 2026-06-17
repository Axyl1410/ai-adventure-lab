import { HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { TTSButton } from "@/components/TTSButton";

interface ImagePromptPreviewProps {
  prompt: string;
}

export function ImagePromptPreview({ prompt }: ImagePromptPreviewProps) {
  const { t } = useTranslation("gameContent");

  return (
    <div className="rounded-3xl border border-yellowLab/30 bg-cream/70 p-4 shadow-sm sm:p-5">
      <h2 className="mb-2 flex items-center gap-1.5 font-black text-base text-ink">
        <HelpCircle className="h-5 w-5 shrink-0 animate-bounce text-orangeLab" />{" "}
        {t("imageStudio.ui.promptUsedLabel")}
      </h2>
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <p className="flex-1 break-words rounded-2xl border border-white/50 bg-white/70 p-3 font-semibold text-muted text-sm italic leading-relaxed">
          {prompt}
        </p>
        <TTSButton compact={true} text={prompt} />
      </div>
    </div>
  );
}
