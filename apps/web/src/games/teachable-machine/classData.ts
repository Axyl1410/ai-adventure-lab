import type { ClassConfig } from "./types";

export const CLASS_KEYS = [
  "smiley_face",
  "waving_hand",
  "school_supplies",
] as const;

export type ClassKey = (typeof CLASS_KEYS)[number];

export const DEFAULT_CLASSES: Omit<ClassConfig, "name">[] = [
  {
    id: 1,
    classKey: "smiley_face",
    emoji: "😊",
    color: "bg-greenLab/10",
    borderColor: "border-greenLab/40",
    accentColor: "bg-greenLab",
  },
  {
    id: 2,
    classKey: "waving_hand",
    emoji: "🖐️",
    color: "bg-yellowLab/10",
    borderColor: "border-yellowLab/40",
    accentColor: "bg-yellowLab",
  },
  {
    id: 3,
    classKey: "school_supplies",
    emoji: "🧸",
    color: "bg-skyLab/10",
    borderColor: "border-skyLab/40",
    accentColor: "bg-skyLab",
  },
];
