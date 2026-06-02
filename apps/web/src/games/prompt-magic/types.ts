export type { PromptCoachResult } from "@ai-adventure/shared";

export type Level = "easy" | "hard";

export type BlockKey = "role" | "task" | "audience" | "style" | "format";

export type SelectedBlocks = Record<BlockKey, string>;
