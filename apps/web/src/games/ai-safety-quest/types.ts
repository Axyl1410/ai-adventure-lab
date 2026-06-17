export type ChoiceId = "do_it" | "dont" | "ask_adult";

export interface ScenarioBase {
  answer: ChoiceId;
  emoji: string;
  id: string;
}

export interface Scenario extends ScenarioBase {
  explain: string;
  text: string;
}
