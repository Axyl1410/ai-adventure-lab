export type Level = "easy" | "hard";

export interface DetectiveQuestionBase {
  answer: boolean;
  emoji: string;
  id: string;
}

export interface DetectiveQuestion extends DetectiveQuestionBase {
  explain: string;
  text: string;
}
