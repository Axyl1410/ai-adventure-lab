import { useTranslation } from "react-i18next";

export function AiGeneratedLabel() {
  const { t } = useTranslation("gameContent");

  return (
    <span className="flex items-center gap-1 rounded-full border border-yellowLab/55 bg-yellowLab/35 px-3 py-1.5 font-black text-ink text-xs">
      {t("imageStudio.ui.aiLabel")}
    </span>
  );
}
