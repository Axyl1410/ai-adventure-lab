import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { safetyService, normalizeText } from "./safety.service";

export class TtsService {
  async speak(text: string, voice?: string) {
    const safeText = normalizeText(text);
    const safety = safetyService.checkText(safeText);
    if (!safety.safe) {
      return { ok: false, message: "Mình không đọc nội dung chưa phù hợp nhé." };
    }
    const safeVoice = sanitizeSlug(voice || process.env.TTS_VOICE || "vi-female", "vi-female");
    if (process.env.TTS_ENABLED === "false") {
      return { ok: false, message: "TTS đang tắt." };
    }

    const uploadRoot = path.resolve(process.env.UPLOAD_DIR || "./uploads");
    const cacheDir = path.join(uploadRoot, "tts-cache");
    await fs.mkdir(cacheDir, { recursive: true });

    // Các câu hướng dẫn trò chơi lặp đi lặp lại được tối ưu hóa tĩnh
    const staticPhrases: Record<string, string> = {
      "Đọc thẻ tình huống rồi chọn Có AI hoặc Không AI.": "instruction-ai-detective",
      "Chọn cấp độ chơi phù hợp với em nhé!": "instruction-level-select",
      "Kéo thả hoặc nhấn để phân loại đồ vật vào đúng nhóm giúp robot học nhé.": "instruction-teach-robot",
      "Camera chỉ dùng trong trình duyệt để AI nhận diện. Ảnh không được gửi lên server.": "instruction-teachable-machine",
      "Nhấp vào các khối lệnh để ghép thành một câu lệnh hoàn chỉnh hướng dẫn AI.": "instruction-prompt-magic",
      "Hãy đọc câu trả lời của AI và xem có lỗi nào không nhé.": "instruction-oops-ai-mistake",
      "Viết prompt vui vẻ để tạo tranh học tập cùng Buddy Bot!": "instruction-image-studio",
      "Trò chuyện với robot học tập Buddy Bot.": "instruction-buddy-bot"
    };

    const hash = crypto.createHash("sha256").update(`${safeVoice}:${safeText}`).digest("hex").slice(0, 32);
    const ext = allowedAudioFormat(process.env.TTS_AUDIO_FORMAT);
    const phraseKey = safeText.trim();
    
    let filename = `${hash}.${ext}`;
    let filePath = path.join(cacheDir, filename);

    if (staticPhrases[phraseKey]) {
      const staticName = `${staticPhrases[phraseKey]}-${safeVoice}.${ext}`;
      const staticPath = path.join(cacheDir, staticName);
      try {
        await fs.access(staticPath);
        return { ok: true, audioUrl: `/api/uploads/tts-cache/${staticName}` };
      } catch {
        // Nếu file tĩnh chưa được lưu, ta sẽ dùng luồng bình thường để tải và đổi tên lưu làm file tĩnh mãi mãi
        filename = staticName;
        filePath = staticPath;
      }
    }

    try {
      await fs.access(filePath);
      return { ok: true, audioUrl: `/api/uploads/tts-cache/${filename}` };
    } catch {
      // cache miss
    }

    const baseUrl = process.env.TTS_BASE_URL;
    if (!baseUrl) return { ok: false, message: "Chưa cấu hình TTS." };

    const provider = process.env.TTS_PROVIDER || "local";

    try {
      let response: Response;
      const targetVoice = safeVoice;

      // Phonetize English acronyms and words to sound natural in Vietnamese TTS
      const ttsInputText = safeText
        .replace(/\*/g, "")
        .replace(/!/g, ".")
        .replace(/\bAI\b/g, "trí tuệ nhân tạo")
        .replace(/\bA\.I\.\b/gi, "trí tuệ nhân tạo")
        .replace(/\bA[.-]I\b/gi, "trí tuệ nhân tạo")
        .replace(/\bFace ID\b/gi, "phây-xờ ai-đi")
        .replace(/\bFaceID\b/gi, "phây-xờ ai-đi")
        .replace(/\bYouTube\b/gi, "du-túp")
        .replace(/\bGoogle Maps\b/gi, "gu-gờ mép")
        .replace(/\bGoogle Translate\b/gi, "gu-gờ dịch")
        .replace(/\bGoogle\b/gi, "gu-gờ")
        .replace(/\bT-rex\b/gi, "ti-rét")
        .replace(/\bWebcam\b/gi, "uép-cam");
      if (provider === "vitts" || provider === "openai") {
        const url = `${baseUrl.replace(/\/$/, "")}/audio/speech`;
        response = await fetch(url, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            input: ttsInputText,
            model: "tts-1",
            voice: targetVoice,
            response_format: ext === "wav" ? "wav" : ext,
            speed: 1.0
          })
        });
      } else {
        const url = `${baseUrl.replace(/\/$/, "")}/tts`;
        response = await fetch(url, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            text: ttsInputText,
            voice: targetVoice,
            format: ext,
            speed: 1.0
          })
        });
      }

      if (!response.ok) throw new Error("tts_failed");
      await fs.writeFile(filePath, Buffer.from(await response.arrayBuffer()));
      return { ok: true, audioUrl: `/api/uploads/tts-cache/${filename}` };
    } catch {
      return { ok: false, message: "TTS chưa sẵn sàng, nhưng em vẫn đọc được chữ trên màn hình." };
    }
  }
}

function allowedAudioFormat(value: string | undefined) {
  return value === "mp3" || value === "ogg" || value === "wav" ? value : "wav";
}

function sanitizeSlug(value: string, fallback: string) {
  const normalized = value.trim();
  return /^[a-zA-Z0-9_-]{1,32}$/.test(normalized) ? normalized : fallback;
}


export const ttsService = new TtsService();
