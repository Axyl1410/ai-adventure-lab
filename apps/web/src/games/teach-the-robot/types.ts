export type Level = "easy" | "hard";

export type GroupName = "Động vật" | "Trái cây" | "Đồ chơi";

export interface Item {
  group: GroupName;
  hint?: string;
  icon: string;
  label: string;
}

export type Answers = Record<string, string>;
