import rateLimit from "express-rate-limit";
import { envNumber } from "../utils/env";

export const apiRateLimit = rateLimit({
  windowMs: envNumber("RATE_LIMIT_WINDOW_MS", 60_000),
  limit: envNumber("RATE_LIMIT_MAX", 30),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Bạn thử hơi nhanh. Nghỉ một chút rồi thử lại nhé." },
});

export const imageRateLimit = rateLimit({
  windowMs: envNumber("IMAGE_RATE_LIMIT_WINDOW_MS", 3_600_000),
  limit: envNumber("IMAGE_RATE_LIMIT_MAX", 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Hôm nay lớp mình đã tạo nhiều tranh rồi. Hãy thử lại sau nhé.",
  },
});
