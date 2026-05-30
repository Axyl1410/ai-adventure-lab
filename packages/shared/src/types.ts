export type GameKey =
  | "ai-detective"
  | "teach-the-robot"
  | "teachable-machine"
  | "prompt-magic"
  | "oops-ai-mistake"
  | "buddy-bot"
  | "image-studio"
  | "data-sorter"
  | "ai-safety-quest";

export interface GameCard {
  key: GameKey;
  title: string;
  description: string;
  difficulty: "Dễ" | "Vừa" | "Khám phá";
  color: string;
  path: string;
}

export interface SafetyResult {
  status: "safe" | "redirected" | "blocked";
  safe: boolean;
  reason?: string;
  message?: string;
}

export interface PromptCoachResult {
  score: number;
  badges: string[];
  feedback: string;
  improvedPrompt: string;
}

export interface GeneratedImageResponse {
  imageId: string;
  imageUrl: string;
  promptUsed: string;
  safetyLevel: "safe";
  label: "Hình này được tạo bởi AI.";
}
