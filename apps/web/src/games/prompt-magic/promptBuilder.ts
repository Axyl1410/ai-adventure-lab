import type { Level, SelectedBlocks } from "./types";

export function buildPrompt(level: Level, selected: SelectedBlocks): string {
  if (level === "easy") {
    return `Hãy ${selected.task} ${selected.audience}, ${selected.style}.`;
  }
  return `${selected.role}, ${selected.task} ${selected.audience}, ${selected.style}, ${selected.format}.`;
}
