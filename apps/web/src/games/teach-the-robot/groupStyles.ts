import type { GroupName } from "./types";

export const LABEL_GROUPS = [
  "Động vật",
  "Trái cây",
  "Đồ chơi",
] as const satisfies readonly GroupName[];

export const groupColors: Record<GroupName, string> = {
  "Động vật":
    "bg-greenLab border-greenLab/50 shadow-md ring-2 ring-greenLab/30",
  "Trái cây":
    "bg-yellowLab border-yellowLab/50 shadow-md ring-2 ring-yellowLab/30",
  "Đồ chơi": "bg-skyLab border-skyLab/50 shadow-md ring-2 ring-skyLab/30",
};

export const groupIdleColors: Record<GroupName, string> = {
  "Động vật":
    "border-greenLab/45 bg-greenLab/20 shadow-soft hover:border-greenLab/60 hover:bg-greenLab/30 hover:shadow-md",
  "Trái cây":
    "border-yellowLab/50 bg-yellowLab/25 shadow-soft hover:border-yellowLab/65 hover:bg-yellowLab/35 hover:shadow-md",
  "Đồ chơi":
    "border-skyLab/45 bg-skyLab/20 shadow-soft hover:border-skyLab/60 hover:bg-skyLab/30 hover:shadow-md",
};

export const groupEmojis: Record<GroupName, string> = {
  "Động vật": "🐾",
  "Trái cây": "🍇",
  "Đồ chơi": "🧸",
};
