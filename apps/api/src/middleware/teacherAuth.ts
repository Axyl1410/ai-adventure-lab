import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";

export function requireTeacher(req: Request, res: Response, next: NextFunction) {
  const expected = process.env.TEACHER_PASSCODE;
  const provided = req.header("x-teacher-passcode") ?? "";
  if (!expected || expected === "change-me" || expected.length < 8 || !timingSafeEqual(provided, expected)) {
    res.status(401).json({ error: "Cần mã giáo viên." });
    return;
  }
  next();
}

function timingSafeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  return aBuffer.length === bBuffer.length && crypto.timingSafeEqual(aBuffer, bBuffer);
}
