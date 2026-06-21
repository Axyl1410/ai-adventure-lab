import { describe, expect, it } from "vitest";
import { prisma } from "../../db/client";
import { safeImagePayload } from "../helpers/fixtures";
import {
  createTestSession,
  getTestAgent,
  TEACHER_HEADERS,
} from "../helpers/testApp";
import { useTestDatabase } from "../helpers/testDb";

describe("Image routes", () => {
  useTestDatabase();
  const agent = getTestAgent();

  it("GET /images/:id trả metadata", async () => {
    const session = await createTestSession(agent);
    const created = await agent
      .post("/api/images/generate")
      .send(safeImagePayload(session.id));

    const res = await agent.get(`/api/images/${created.body.imageId}`);
    expect(res.status).toBe(200);
    expect(res.body.promptUsed).toBeTruthy();
  });

  it("GET /images/:id không tồn tại trả 404", async () => {
    const res = await agent.get("/api/images/ck12345678901234567890123");
    expect(res.status).toBe(404);
  });

  it("DELETE /images/:id cần teacher auth", async () => {
    const session = await createTestSession(agent);
    const created = await agent
      .post("/api/images/generate")
      .send(safeImagePayload(session.id));

    const unauthorized = await agent.delete(
      `/api/images/${created.body.imageId}`
    );
    expect(unauthorized.status).toBe(401);

    const authorized = await agent
      .delete(`/api/images/${created.body.imageId}`)
      .set(TEACHER_HEADERS);
    expect(authorized.status).toBe(200);

    const gone = await prisma.generatedImage.findUnique({
      where: { id: created.body.imageId },
    });
    expect(gone).toBeNull();
  });
});
