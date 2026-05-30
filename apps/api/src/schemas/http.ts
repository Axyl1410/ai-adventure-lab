import { z } from "zod";

export const idParamSchema = z.object({ id: z.string().min(1) });
export const sessionParamSchema = z.object({ id: z.string().min(1) });
export const progressParamSchema = z.object({ sessionId: z.string().min(1) });
export const imageParamSchema = z.object({ imageId: z.string().min(1) });

export const explainSchema = z.object({
  sessionId: z.string().min(1),
  topic: z.string().trim().min(1).max(500)
});

export const teacherPasscodeSchema = z.object({
  passcode: z.string().min(1)
});
