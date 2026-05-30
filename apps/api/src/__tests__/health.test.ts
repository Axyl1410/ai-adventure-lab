import { describe, it, expect } from "vitest";
import request from "supertest";
import { createServer } from "../server";

const app = createServer();

describe("GET /api/health", () => {
  it("trả về 200 và ok=true", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.app).toBe("AI Adventure Lab");
  });
});

describe("Route không tồn tại", () => {
  it("trả về 404", async () => {
    const res = await request(app).get("/api/không-tồn-tại");
    expect(res.status).toBe(404);
  });
});
