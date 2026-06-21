import { describe, expect, it } from "vitest";
import { DECK_SIZE } from "../constants";
import { ALL_ITEMS } from "../items";

describe("ALL_ITEMS", () => {
  it("đủ số lượng cho một phiên chơi", () => {
    expect(ALL_ITEMS.length).toBeGreaterThanOrEqual(DECK_SIZE);
  });

  it("mỗi card có category hợp lệ", () => {
    for (const item of ALL_ITEMS) {
      expect(["good", "noisy", "private"]).toContain(item.category);
    }
  });

  it("dữ liệu nhạy cảm thuộc private", () => {
    const privateIds = ["classmate_phone", "student_home_address"];
    for (const id of privateIds) {
      const item = ALL_ITEMS.find((card) => card.id === id);
      expect(item?.category).toBe("private");
    }
  });
});
