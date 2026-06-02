import { KNN_EPSILON, KNN_K } from "./constants";
import type { Example, Predictions } from "./types";

/** Distance-weighted KNN classifier over stored examples. */
export function predictClassWeighted(
  currentFeatures: number[],
  examples: Example[]
): Predictions {
  const probabilities: Predictions = { 1: 0, 2: 0, 3: 0 };
  if (examples.length === 0) {
    return probabilities;
  }

  const distances = examples.map((ex) => {
    let sum = 0;
    for (let i = 0; i < currentFeatures.length; i++) {
      const diff = currentFeatures[i] - ex.features[i];
      sum += diff * diff;
    }
    const dist = Math.sqrt(sum);
    return { classId: ex.classId, dist };
  });

  distances.sort((a, b) => a.dist - b.dist);

  const k = Math.min(KNN_K, examples.length);
  const topK = distances.slice(0, k);

  const weights: Record<number, number> = {};
  let totalWeight = 0;

  for (const item of topK) {
    const w = 1 / (item.dist + KNN_EPSILON);
    weights[item.classId] = (weights[item.classId] || 0) + w;
    totalWeight += w;
  }

  if (totalWeight > 0) {
    for (const classIdStr of Object.keys(weights)) {
      const classId = Number(classIdStr);
      probabilities[classId] = weights[classId] / totalWeight;
    }
  }

  return probabilities;
}
