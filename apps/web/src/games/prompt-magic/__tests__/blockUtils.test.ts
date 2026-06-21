import { describe, expect, it } from "vitest";
import { PROMPT_BLOCK_IDS } from "../blockData";
import { getActiveBlockEntries, getDefaultSelected } from "../blockUtils";
import { EASY_BLOCK_KEYS } from "../constants";

describe("blockUtils", () => {
  it("getDefaultSelected chọn id đầu mỗi block", () => {
    const selected = getDefaultSelected();
    expect(selected.role).toBe(PROMPT_BLOCK_IDS.role[0]);
    expect(selected.task).toBe(PROMPT_BLOCK_IDS.task[0]);
  });

  it("getActiveBlockEntries easy chỉ có 3 keys", () => {
    const entries = getActiveBlockEntries("easy");
    expect(entries.map(([key]) => key)).toEqual(EASY_BLOCK_KEYS);
    expect(entries).toHaveLength(3);
  });

  it("getActiveBlockEntries hard có đủ 5 keys", () => {
    const entries = getActiveBlockEntries("hard");
    expect(entries).toHaveLength(5);
  });
});
