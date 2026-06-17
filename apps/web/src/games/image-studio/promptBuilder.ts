import type { TFunction } from "i18next";
import {
  imageColorLabel,
  imageMoodLabel,
  imageStyleLabel,
  imageThemeLabel,
  resolveImageDetails,
} from "@/lib/gameContent";
import type { ImageDetails } from "./types";

type ContentT = TFunction<"gameContent">;

export function buildStudentPrompt(
  t: ContentT,
  themeId: string,
  styleId: string,
  details: ImageDetails
): string {
  const { subject, setting } = resolveImageDetails(t, details);
  const theme = imageThemeLabel(t, themeId);
  const style = imageStyleLabel(t, styleId);
  const colors = details.colors.map((id) => imageColorLabel(t, id)).join(", ");
  const mood = imageMoodLabel(t, details.mood);
  const textOption = details.includeText
    ? t("imageStudio.ui.promptWithText")
    : t("imageStudio.ui.promptWithoutText");

  return t("imageStudio.ui.promptTemplate", {
    style,
    subject,
    setting,
    theme,
    colors,
    mood,
    textOption,
  });
}
