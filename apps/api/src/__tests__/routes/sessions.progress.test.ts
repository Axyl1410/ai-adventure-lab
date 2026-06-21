import { describe, expect, it } from "vitest";
import { safeProgressPayload } from "../helpers/fixtures";
import { createTestSession, getTestAgent } from "../helpers/testApp";
import { useTestDatabase } from "../helpers/testDb";

describe("Sessions & progress", () => {
  useTestDatabase();
  const agent = getTestAgent();

  it("POST /sessions tạo phiên mới", async () => {
    const res = await agent.post("/api/sessions").send({
      nickname: "BéNam",
      ageGroup: "9-11",
    });
    expect(res.status).toBe(201);
    expect(res.body.nickname).toBe("BéNam");
    expect(res.body.ageGroup).toBe("9-11");
    expect(res.body.id).toMatch(/^c[a-z0-9]{24}$/u);
  });

  it("GET /sessions/:id trả phiên đã tạo", async () => {
    const session = await createTestSession(agent);
    const res = await agent.get(`/api/sessions/${session.id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(session.id);
  });

  it("GET /sessions/:id không tồn tại trả 404", async () => {
    const res = await agent.get("/api/sessions/ck12345678901234567890123");
    expect(res.status).toBe(404);
    expect(res.body.error).toContain("Không tìm thấy");
  });

  it("POST /progress session không tồn tại trả 404", async () => {
    const res = await agent
      .post("/api/progress")
      .send(safeProgressPayload("ck12345678901234567890123"));
    expect(res.status).toBe(404);
  });

  it("POST /progress lưu tiến độ", async () => {
    const session = await createTestSession(agent);
    const res = await agent
      .post("/api/progress")
      .send(safeProgressPayload(session.id));
    expect(res.status).toBe(201);
    expect(res.body.gameKey).toBe("ai-detective");
    expect(res.body.score).toBe(4);
  });

  it("GET /progress/:sessionId round-trip metadata", async () => {
    const session = await createTestSession(agent);
    await agent.post("/api/progress").send({
      ...safeProgressPayload(session.id),
      metadata: { level: "hard", rounds: 3 },
    });

    const res = await agent.get(`/api/progress/${session.id}`);
    expect(res.status).toBe(200);
    expect(res.body.progress).toHaveLength(1);
    expect(JSON.parse(res.body.progress[0].metadata)).toEqual({
      level: "hard",
      rounds: 3,
    });
  });

  it("POST /sessions dùng giá trị mặc định", async () => {
    const res = await agent.post("/api/sessions").send({});
    expect(res.status).toBe(201);
    expect(res.body.nickname).toBe("Bạn nhỏ");
    expect(res.body.mode).toBe("student");
  });
});
