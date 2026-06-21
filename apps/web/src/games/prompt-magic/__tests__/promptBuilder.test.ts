import type { TFunction } from "i18next";
import { describe, expect, it } from "vitest";
import { getDefaultSelected } from "../blockUtils";
import { buildPrompt } from "../promptBuilder";

const t = ((key: string, options?: Record<string, string>) => {
  if (key === "promptMagic.promptTemplate") {
    return `EASY:${options?.task}|${options?.audience}|${options?.style}`;
  }
  const id = key.split(".").pop() ?? key;
  return `BLOCK_${id}`;
}) as TFunction<"gameContent">;

describe("buildPrompt", () => {
  const selected = getDefaultSelected();

  it("easy level dùng promptTemplate", () => {
    const prompt = buildPrompt(t, "easy", selected);
    expect(prompt.startsWith("EASY:")).toBe(true);
    expect(prompt).toContain("BLOCK_");
  });

  it("hard level ghép role và format", () => {
    const prompt = buildPrompt(t, "hard", selected);
    expect(prompt).toContain("BLOCK_");
    expect(prompt.endsWith(".")).toBe(true);
  });
});

describe("getDefaultSelected", () => {
  it("chọn block đầu tiên mỗi nhóm", () => {
    const selected = getDefaultSelected();
    expect(selected.role).toBeTruthy();
    expect(selected.task).toBeTruthy();
    expect(selected.audience).toBeTruthy();
    expect(selected.style).toBeTruthy();
    expect(selected.format).toBeTruthy();
  });
});
