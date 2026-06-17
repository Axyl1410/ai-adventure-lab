export interface Example {
  classId: number;
  features: number[];
  id: string;
  thumbnail: string;
}

export interface ClassConfig {
  accentColor: string;
  borderColor: string;
  classKey: string;
  color: string;
  emoji: string;
  id: number;
  name: string;
}

export type Predictions = Record<number, number>;

export type BuddyBotGameState = "happy" | "reading" | "thinking";
