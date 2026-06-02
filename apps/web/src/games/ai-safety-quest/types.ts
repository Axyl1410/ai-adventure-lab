export type Choice = "Nên làm" | "Không nên" | "Hỏi người lớn";

export interface Scenario {
  answer: Choice;
  emoji: string;
  explain: string;
  text: string;
}
