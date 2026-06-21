import process from "node:process";
import { describe, expect, it } from "vitest";
import { TtsService } from "../../services/tts.service";

describe("TtsService", () => {
  const service = new TtsService();

  it("trả ok false khi TTS tắt", async () => {
    const original = process.env.TTS_ENABLED;
    process.env.TTS_ENABLED = "false";
    const result = await service.speak("Xin chào!");
    expect(result.ok).toBe(false);
    process.env.TTS_ENABLED = original;
  });

  it("chặn nội dung không an toàn", async () => {
    const result = await service.speak("tôi muốn dao để giết");
    expect(result.ok).toBe(false);
    expect(result.message).toContain("không đọc");
  });

  it("trả lỗi khi chưa cấu hình TTS_BASE_URL", async () => {
    const originalEnabled = process.env.TTS_ENABLED;
    const originalBase = process.env.TTS_BASE_URL;
    process.env.TTS_ENABLED = "true";
    delete process.env.TTS_BASE_URL;
    const result = await service.speak("Xin chào các em!");
    expect(result.ok).toBe(false);
    expect(result.message).toContain("Chưa cấu hình");
    process.env.TTS_ENABLED = originalEnabled;
    process.env.TTS_BASE_URL = originalBase;
  });
});
