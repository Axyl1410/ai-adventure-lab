import { PROMPT_BLOCKS } from "./blockData";
import { EASY_BLOCK_KEYS } from "./constants";
import type { BlockKey, Level, SelectedBlocks } from "./types";

export function getDefaultSelected(): SelectedBlocks {
  return {
    role: PROMPT_BLOCKS.role[0],
    task: PROMPT_BLOCKS.task[0],
    audience: PROMPT_BLOCKS.audience[0],
    style: PROMPT_BLOCKS.style[0],
    format: PROMPT_BLOCKS.format[0],
  };
}

export function getActiveBlockEntries(level: Level): [BlockKey, string[]][] {
  const keys =
    level === "easy"
      ? EASY_BLOCK_KEYS
      : (Object.keys(PROMPT_BLOCKS) as BlockKey[]);
  return keys.map((key) => [key, PROMPT_BLOCKS[key]]);
}
