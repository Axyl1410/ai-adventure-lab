import { describe, expect, it } from "vitest";
import {
  chatSchema,
  imageGenerateSchema,
  progressSchema,
  sessionSchema,
  ttsSchema,
} from "../schemas";

describe("sessionSchema", () => {
  it("nhận dữ liệu hợp lệ", () => {
    const result = sessionSchema.safeParse({
      nickname: "BéNam",
      ageGroup: "6-8",
    });
    expect(result.success).toBe(true);
  });
  it("dùng giá trị mặc định khi thiếu field", () => {
    const result = sessionSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.nickname).toBe("Bạn nhỏ");
      expect(result.data.mode).toBe("student");
    }
  });
  it("từ chối nickname quá dài", () => {
    const result = sessionSchema.safeParse({ nickname: "A".repeat(25) });
    expect(result.success).toBe(false);
  });
  it("từ chối ageGroup không hợp lệ", () => {
    const result = sessionSchema.safeParse({ ageGroup: "3-5" });
    expect(result.success).toBe(false);
  });
});

describe("chatSchema", () => {
  it("nhận message hợp lệ", () => {
    const result = chatSchema.safeParse({
      sessionId: "ck12345678901234567890123",
      message: "AI là gì?",
    });
    expect(result.success).toBe(true);
  });
  it("từ chối message quá dài", () => {
    const result = chatSchema.safeParse({
      sessionId: "ck12345678901234567890123",
      message: "x".repeat(801),
    });
    expect(result.success).toBe(false);
  });
  it("từ chối message rỗng", () => {
    const result = chatSchema.safeParse({
      sessionId: "ck12345678901234567890123",
      message: "   ",
    });
    expect(result.success).toBe(false);
  });
});

describe("ttsSchema", () => {
  it("nhận text hợp lệ", () => {
    const result = ttsSchema.safeParse({ text: "Xin chào!" });
    expect(result.success).toBe(true);
  });
  it("từ chối text quá dài", () => {
    const result = ttsSchema.safeParse({ text: "a".repeat(801) });
    expect(result.success).toBe(false);
  });
});

describe("progressSchema", () => {
  it("nhận progress hợp lệ", () => {
    const result = progressSchema.safeParse({
      sessionId: "ck12345678901234567890123",
      gameKey: "ai-detective",
      score: 4,
      maxScore: 5,
    });
    expect(result.success).toBe(true);
  });
  it("từ chối score âm", () => {
    const result = progressSchema.safeParse({
      sessionId: "ck12345678901234567890123",
      gameKey: "ai-detective",
      score: -1,
      maxScore: 5,
    });
    expect(result.success).toBe(false);
  });
  it("từ chối maxScore = 0", () => {
    const result = progressSchema.safeParse({
      sessionId: "ck12345678901234567890123",
      gameKey: "ai-detective",
      score: 0,
      maxScore: 0,
    });
    expect(result.success).toBe(false);
  });
});

describe("imageGenerateSchema", () => {
  const base = {
    sessionId: "ck12345678901234567890123",
    theme: "Robot trong lớp học",
    style: "Tranh hoạt hình",
    details: {
      subject: "chú mèo",
      setting: "lớp học",
      colors: ["xanh da trời"],
      mood: "vui vẻ",
    },
  };
  it("nhận input hợp lệ", () => {
    expect(imageGenerateSchema.safeParse(base).success).toBe(true);
  });
  it("từ chối thiếu sessionId", () => {
    const { sessionId: _, ...rest } = base;
    expect(imageGenerateSchema.safeParse(rest).success).toBe(false);
  });
});
