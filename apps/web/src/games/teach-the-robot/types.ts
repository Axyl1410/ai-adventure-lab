export type Level = "easy" | "hard";

export type GroupId = "animals" | "fruit" | "toys";

export interface ItemBase {
  group: GroupId;
  icon: string;
  id: string;
}

export interface Item extends ItemBase {
  hint?: string;
  label: string;
}

export type Answers = Record<string, GroupId>;
