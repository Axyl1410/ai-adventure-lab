export type VerdictId = "correct" | "wrong" | "needs_check";

export type Level = "easy" | "hard";

export interface OopsQuestionBase {
  answer: VerdictId;
  id: string;
}

export interface OopsQuestion extends OopsQuestionBase {
  explain: string;
  text: string;
}
