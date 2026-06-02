import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({ error: "Dữ liệu chưa đúng.", details: parsed.error.flatten() });
      return;
    }
    req.body = parsed.data;
    next();
  };
}

export function validateParams<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({
        error: "Tham số URL không hợp lệ.",
        details: parsed.error.flatten(),
      });
      return;
    }
    req.params = parsed.data as Request["params"];
    next();
  };
}
