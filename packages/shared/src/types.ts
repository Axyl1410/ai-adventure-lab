export type GameKey =
  | "ai-detective"
  | "teach-the-robot"
  | "teachable-machine"
  | "prompt-magic"
  | "oops-ai-mistake"
  | "buddy-bot"
  | "image-studio"
  | "data-sorter"
  | "ai-safety-quest"
  | "robot-commands"
  | "ai-recommendations";

export interface GameCard {
  color: string;
  description: string;
  difficulty: "Dễ" | "Vừa" | "Khám phá";
  key: GameKey;
  path: string;
  title: string;
}

export interface SafetyResult {
  message?: string;
  reason?: string;
  safe: boolean;
  status: "safe" | "redirected" | "blocked";
}

export interface PromptCoachResult {
  badges: string[];
  feedback: string;
  improvedPrompt: string;
  score: number;
}

export interface GeneratedImageResponse {
  imageId: string;
  imageUrl: string;
  label: "Hình này được tạo bởi AI.";
  promptUsed: string;
  safetyLevel: "safe";
}
