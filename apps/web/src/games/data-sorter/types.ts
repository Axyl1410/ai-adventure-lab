export type CategoryId = "good" | "noisy" | "private";

export interface SorterCardBase {
  category: CategoryId;
  emoji: string;
  id: string;
}

export interface SorterCard extends SorterCardBase {
  explain: string;
  text: string;
}
