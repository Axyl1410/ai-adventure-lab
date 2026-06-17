import type { BlockKey } from "./types";

export const PROMPT_BLOCK_IDS: Record<BlockKey, string[]> = {
  role: ["role_1", "role_2", "role_3", "role_4", "role_5"],
  task: ["task_1", "task_2", "task_3", "task_4", "task_5"],
  audience: [
    "audience_1",
    "audience_2",
    "audience_3",
    "audience_4",
    "audience_5",
  ],
  style: ["style_1", "style_2", "style_3", "style_4", "style_5"],
  format: ["format_1", "format_2", "format_3", "format_4", "format_5"],
};
