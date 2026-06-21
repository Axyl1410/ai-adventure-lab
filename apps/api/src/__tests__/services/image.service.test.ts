import { describe, expect, it } from "vitest";
import { ImageService } from "../../services/image.service";
import { safeImagePayload, unsafeImagePayload } from "../helpers/fixtures";

describe("ImageService", () => {
  const service = new ImageService();

  it("buildPrompt an toàn trả prompt", async () => {
    const result = await service.buildPrompt(
      safeImagePayload("ck12345678901234567890123")
    );
    expect(result.safe).toBe(true);
    expect(result.prompt).toContain("robot");
  });

  it("buildPrompt unsafe trả studentMessage", async () => {
    const result = await service.buildPrompt(
      unsafeImagePayload("ck12345678901234567890123")
    );
    expect(result.safe).toBe(false);
    expect(result.prompt).toBe("");
    expect(result.studentMessage).toBeTruthy();
  });

  it("buildPrompt en locale", async () => {
    const input = safeImagePayload("ck12345678901234567890123");
    input.locale = "en";
    const result = await service.buildPrompt(input);
    expect(result.safe).toBe(true);
    expect(result.prompt.toLowerCase()).toContain("children");
  });

  it("generateImageFile fallback SVG khi không có API key", async () => {
    const result = await service.generateImageFile(
      "cute robot in classroom",
      "test-image-id",
      "cartoon"
    );
    expect(result.filePath).toContain("test-image-id");
    expect(result.filename).toMatch(/\.svg$/u);
  });
});
