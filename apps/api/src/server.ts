import path from "node:path";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { apiRateLimit } from "./middleware/rateLimits";
import { routes } from "./routes";

export function createServer() {
  const app = express();
  const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
  const uploadRoot = path.resolve(process.env.UPLOAD_DIR || "./uploads");

  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(cors({ origin: corsOrigin.split(",").map((item) => item.trim()), credentials: false }));
  app.use(express.json({ limit: "1mb" }));
  app.use(apiRateLimit);
  app.use("/api/uploads", express.static(uploadRoot, { fallthrough: false, maxAge: "1h" }));
  app.use("/api", routes);

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: "Có lỗi xảy ra. Em thử lại sau nhé." });
  });

  return app;
}
