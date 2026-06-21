import type { Test } from "supertest";
import request from "supertest";
import { createServer } from "../../server";

export function getTestAgent(): Test {
  return request(createServer());
}

export async function createTestSession(
  agent: Test,
  overrides: { nickname?: string; ageGroup?: "6-8" | "9-11" } = {}
) {
  const res = await agent
    .post("/api/sessions")
    .send({
      nickname: overrides.nickname ?? "Bạn nhỏ",
      ageGroup: overrides.ageGroup ?? "6-8",
    })
    .expect(201);

  return res.body as { id: string; nickname: string; ageGroup: string };
}

export const TEACHER_HEADERS = {
  "x-teacher-passcode": "test-pass-12345",
};
