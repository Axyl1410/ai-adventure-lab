import process from "node:process";
import type { NextFunction, Request, Response } from "express";
import { afterEach, describe, expect, it } from "vitest";
import { requireTeacher } from "../../middleware/teacherAuth";
import { getTestAgent, TEACHER_HEADERS } from "../helpers/testApp";
import { useTestDatabase } from "../helpers/testDb";

function mockResponse() {
  const res = {
    statusCode: 200,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
  };
  return res as Response & { statusCode: number; body: unknown };
}

describe("requireTeacher middleware", () => {
  const originalPasscode = process.env.TEACHER_PASSCODE;

  afterEach(() => {
    process.env.TEACHER_PASSCODE = originalPasscode;
  });

  it("từ chối khi thiếu header", () => {
    const req = { header: () => undefined } as Request;
    const res = mockResponse();
    let nextCalled = false;
    requireTeacher(req, res, (() => {
      nextCalled = true;
    }) as NextFunction);
    expect(res.statusCode).toBe(401);
    expect(nextCalled).toBe(false);
  });

  it("từ chối passcode sai", () => {
    process.env.TEACHER_PASSCODE = "test-pass-12345";
    const req = {
      header: (name: string) =>
        name === "x-teacher-passcode" ? "wrong-code" : undefined,
    } as Request;
    const res = mockResponse();
    requireTeacher(req, res, (() => undefined) as NextFunction);
    expect(res.statusCode).toBe(401);
  });

  it("từ chối passcode mặc định change-me", () => {
    process.env.TEACHER_PASSCODE = "change-me";
    const req = {
      header: (name: string) =>
        name === "x-teacher-passcode" ? "change-me" : undefined,
    } as Request;
    const res = mockResponse();
    requireTeacher(req, res, (() => undefined) as NextFunction);
    expect(res.statusCode).toBe(401);
  });

  it("từ chối passcode quá ngắn", () => {
    process.env.TEACHER_PASSCODE = "short";
    const req = {
      header: (name: string) =>
        name === "x-teacher-passcode" ? "short" : undefined,
    } as Request;
    const res = mockResponse();
    requireTeacher(req, res, (() => undefined) as NextFunction);
    expect(res.statusCode).toBe(401);
  });

  it("cho qua passcode đúng", () => {
    process.env.TEACHER_PASSCODE = "test-pass-12345";
    const req = {
      header: (name: string) =>
        name === "x-teacher-passcode" ? "test-pass-12345" : undefined,
    } as Request;
    const res = mockResponse();
    let nextCalled = false;
    requireTeacher(req, res, (() => {
      nextCalled = true;
    }) as NextFunction);
    expect(nextCalled).toBe(true);
  });
});

describe("requireTeacher on route", () => {
  useTestDatabase();
  const agent = getTestAgent();

  it("GET /api/teacher/stats trả 401 khi không có passcode", async () => {
    const res = await agent.get("/api/teacher/stats");
    expect(res.status).toBe(401);
  });

  it("GET /api/teacher/stats trả 200 khi passcode đúng", async () => {
    const res = await agent.get("/api/teacher/stats").set(TEACHER_HEADERS);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("sessions");
    expect(res.body).toHaveProperty("progress");
  });
});
