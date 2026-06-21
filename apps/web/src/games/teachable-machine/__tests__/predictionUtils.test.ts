import { describe, expect, it } from "vitest";
import { DEFAULT_CLASSES } from "../classData";
import { countDistinctClassIds, getTopPrediction } from "../predictionUtils";
import type { ClassConfig, Example } from "../types";

const classesWithNames: ClassConfig[] = DEFAULT_CLASSES.map((item) => ({
  ...item,
  name: item.classKey,
}));

describe("countDistinctClassIds", () => {
  it("trả 0 khi rỗng", () => {
    expect(countDistinctClassIds([])).toBe(0);
  });

  it("đếm class duy nhất", () => {
    const examples: Example[] = [
      { classId: 1, features: [0] },
      { classId: 1, features: [1] },
      { classId: 2, features: [2] },
    ];
    expect(countDistinctClassIds(examples)).toBe(2);
  });
});

describe("getTopPrediction", () => {
  it("chọn class có xác suất cao nhất", () => {
    const top = getTopPrediction({ 1: 0.1, 2: 0.8, 3: 0.1 }, classesWithNames);
    expect(top.id).toBe(2);
    expect(top.prob).toBe(0.8);
    expect(top.name).toBe("waving_hand");
  });

  it("fallback khi class không tồn tại", () => {
    const top = getTopPrediction({ 1: 0, 2: 0, 3: 0.9 }, []);
    expect(top.name).toBe("Chưa nhận diện");
    expect(top.emoji).toBe("❓");
  });

  it("tie chọn một trong các class", () => {
    const top = getTopPrediction({ 1: 0.5, 2: 0.5, 3: 0 }, classesWithNames);
    expect(top.prob).toBe(0.5);
    expect([1, 2]).toContain(top.id);
  });
});
