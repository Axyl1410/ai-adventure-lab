import type { GroupId } from "./types";

export const LABEL_GROUPS = [
  "animals",
  "fruit",
  "toys",
] as const satisfies readonly GroupId[];

export const groupColors: Record<GroupId, string> = {
  animals: "bg-greenLab border-greenLab/50 shadow-md ring-2 ring-greenLab/30",
  fruit: "bg-yellowLab border-yellowLab/50 shadow-md ring-2 ring-yellowLab/30",
  toys: "bg-skyLab border-skyLab/50 shadow-md ring-2 ring-skyLab/30",
};

export const groupIdleColors: Record<GroupId, string> = {
  animals:
    "border-greenLab/45 bg-greenLab/20 shadow-soft hover:border-greenLab/60 hover:bg-greenLab/30 hover:shadow-md",
  fruit:
    "border-yellowLab/50 bg-yellowLab/25 shadow-soft hover:border-yellowLab/65 hover:bg-yellowLab/35 hover:shadow-md",
  toys: "border-skyLab/45 bg-skyLab/20 shadow-soft hover:border-skyLab/60 hover:bg-skyLab/30 hover:shadow-md",
};

export const groupEmojis: Record<GroupId, string> = {
  animals: "🐾",
  fruit: "🍇",
  toys: "🧸",
};
