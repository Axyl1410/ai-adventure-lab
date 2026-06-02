import type { ClassConfig, Example, Predictions } from "./types";

export function countDistinctClassIds(examples: Example[]): number {
  return new Set(examples.map((ex) => ex.classId)).size;
}

export interface TopPrediction {
  emoji: string;
  id: number;
  name: string;
  prob: number;
}

export function getTopPrediction(
  predictions: Predictions,
  classes: ClassConfig[]
): TopPrediction {
  const max = Object.entries(predictions).reduce(
    (acc, [classId, prob]) =>
      prob > acc.prob ? { id: Number(classId), prob } : acc,
    { id: 0, prob: 0 }
  );

  const match = classes.find((c) => c.id === max.id);
  return {
    id: max.id,
    prob: max.prob,
    name: match?.name ?? "Chưa nhận diện",
    emoji: match?.emoji ?? "❓",
  };
}
