import type { AiQuestion } from "@/lib/api";

export type Level = "easy" | "hard";

export interface DetectiveQuestion extends AiQuestion {
  emoji: string;
}
