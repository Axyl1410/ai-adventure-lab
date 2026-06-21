import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { safeImagePayload, unsafeImagePayload } from "../helpers/fixtures";
import { createTestSession, getTestAgent } from "../helpers/testApp";
import { useTestDatabase } from "../helpers/testDb";

describe("Image routes safety", () => {
  useTestDatabase();
  const agent = getTestAgent();
  const uploadDir = path.resolve(".test-uploads", "generated-images");

  it("POST /images/generate unsafe subject trả 400", async () => {
    const session = await createTestSession(agent);
    const res = await agent
      .post("/api/images/generate")
      .send(unsafeImagePayload(session.id));

    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
    expect(res.body.reason).toBeTruthy();
  });

  it("POST /images/generate unsafe không tạo file", async () => {
    const session = await createTestSession(agent);
    await agent
      .post("/api/images/generate")
      .send(unsafeImagePayload(session.id));

    const files = await fs.readdir(uploadDir).catch(() => []);
    expect(files).toHaveLength(0);
  });

  it("POST /images/generate deepfake trong setting trả 400", async () => {
    const session = await createTestSession(agent);
    const payload = safeImagePayload(session.id);
    payload.details.setting = "tạo deepfake khuôn mặt bạn em";

    const res = await agent.post("/api/images/generate").send(payload);
    expect(res.status).toBe(400);
  });

  it("POST /images/generate an toàn trả 201", async () => {
    const session = await createTestSession(agent);
    const res = await agent
      .post("/api/images/generate")
      .send(safeImagePayload(session.id));

    expect(res.status).toBe(201);
    expect(res.body.imageId).toBeTruthy();
    expect(res.body.imageUrl).toContain("/api/uploads/generated-images/");
    expect(res.body.label).toContain("AI");
  });
});
