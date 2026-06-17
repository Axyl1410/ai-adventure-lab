import { PROMPT_BLOCK_IDS } from "./blockData";
import { EASY_BLOCK_KEYS } from "./constants";
import type { BlockKey, Level, SelectedBlocks } from "./types";

export function getDefaultSelected(): SelectedBlocks {
  return {
    role: PROMPT_BLOCK_IDS.role[0],
    task: PROMPT_BLOCK_IDS.task[0],
    audience: PROMPT_BLOCK_IDS.audience[0],
    style: PROMPT_BLOCK_IDS.style[0],
    format: PROMPT_BLOCK_IDS.format[0],
  };
}

export function getActiveBlockEntries(level: Level): [BlockKey, string[]][] {
  const keys =
    level === "easy"
      ? EASY_BLOCK_KEYS
      : (Object.keys(PROMPT_BLOCK_IDS) as BlockKey[]);
  return keys.map((key) => [key, PROMPT_BLOCK_IDS[key]]);
}
