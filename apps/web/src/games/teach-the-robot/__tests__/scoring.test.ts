import { describe, expect, it } from "vitest";
import { WEAK_THRESHOLD } from "../constants";
import { countCorrect, getLabelProgress, isWeakModel } from "../scoring";
import type { Answers, Item } from "../types";

const items: Item[] = [
  { id: "a", emoji: "🐱", group: "animals", icon: "🐱", label: "Mèo" },
  { id: "b", emoji: "🍎", group: "fruit", icon: "🍎", label: "Táo" },
  { id: "c", emoji: "🚗", group: "toys", icon: "🚗", label: "Xe" },
  { id: "d", emoji: "⚽", group: "toys", icon: "⚽", label: "Bóng" },
];

describe("countCorrect", () => {
  it("đếm đúng hoàn toàn", () => {
    const answers: Answers = {
      a: "animals",
      b: "fruit",
      c: "toys",
      d: "toys",
    };
    expect(countCorrect(items, answers)).toBe(4);
  });

  it("đếm một phần", () => {
    const answers: Answers = {
      a: "animals",
      b: "fruit",
      c: "animals",
      d: "fruit",
    };
    expect(countCorrect(items, answers)).toBe(2);
  });
});

describe("getLabelProgress", () => {
  it("trả 0 khi total = 0", () => {
    expect(getLabelProgress(0, 0)).toBe(0);
  });

  it("tính phần trăm làm tròn", () => {
    expect(getLabelProgress(1, 4)).toBe(25);
    expect(getLabelProgress(4, 4)).toBe(100);
  });
});

describe("isWeakModel", () => {
  it(`weak khi correct < ${WEAK_THRESHOLD}`, () => {
    expect(isWeakModel(WEAK_THRESHOLD - 1)).toBe(true);
  });

  it(`không weak khi correct >= ${WEAK_THRESHOLD}`, () => {
    expect(isWeakModel(WEAK_THRESHOLD)).toBe(false);
  });
});
