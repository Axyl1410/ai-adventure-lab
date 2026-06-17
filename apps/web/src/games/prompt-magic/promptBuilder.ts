import type { TFunction } from "i18next";
import type { Level, SelectedBlocks } from "./types";

type ContentT = TFunction<"gameContent">;

function blockText(t: ContentT, key: keyof SelectedBlocks, blockId: string) {
  return t(`promptMagic.blocks.${key}.${blockId}`);
}

export function buildPrompt(
  t: ContentT,
  level: Level,
  selected: SelectedBlocks
): string {
  const task = blockText(t, "task", selected.task);
  const audience = blockText(t, "audience", selected.audience);
  const style = blockText(t, "style", selected.style);

  if (level === "easy") {
    return t("promptMagic.promptTemplate", { task, audience, style });
  }

  const role = blockText(t, "role", selected.role);
  const format = blockText(t, "format", selected.format);
  return `${role}, ${task} ${audience}, ${style}, ${format}.`;
}
