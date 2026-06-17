import type { TFunction } from "i18next";

type ContentT = TFunction<"gameContent">;

export function buildStoryPrompt(t: ContentT, promptUsed: string): string {
  return t("imageStudio.ui.storyPromptTemplate", { promptUsed });
}

export function getBuddyStoryState(t: ContentT, promptUsed: string) {
  return { storyPrompt: buildStoryPrompt(t, promptUsed) };
}
