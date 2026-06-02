import dotenv from "dotenv";

// Load env variables
dotenv.config();

import process from "node:process";
import { ttsService } from "../services/tts.service";

const staticPhrases = [
  "Đọc thẻ tình huống rồi chọn Có AI hoặc Không AI.",
  "Chọn cấp độ chơi phù hợp với em nhé!",
  "Kéo thả hoặc nhấn để phân loại đồ vật vào đúng nhóm giúp robot học nhé.",
  "Camera chỉ dùng trong trình duyệt để AI nhận diện. Ảnh không được gửi lên server.",
  "Nhấp vào các khối lệnh để ghép thành một câu lệnh hoàn chỉnh hướng dẫn AI.",
  "Hãy đọc câu trả lời của AI và xem có lỗi nào không nhé.",
  "Viết prompt vui vẻ để tạo tranh học tập cùng Buddy Bot!",
  "Trò chuyện với robot học tập Buddy Bot.",
];

// Pregenerate for:
// 1. undefined (uses default config in tts.service, cached as default)
// 2. ngochuyen (standard Piper female)
// 3. minhkhang (standard Piper male)
const voices = [undefined, "ngochuyen", "minhkhang"];

async function main() {
  console.log("🚀 Starting TTS instruction pre-generation...");
  console.log(`📍 TTS Base URL: ${process.env.TTS_BASE_URL}`);
  console.log(`📍 TTS Provider: ${process.env.TTS_PROVIDER}`);

  for (const voice of voices) {
    console.log(`\n🔊 Generating for voice: ${voice || "default config"}`);
    for (const phrase of staticPhrases) {
      console.log(`  - "${phrase}"...`);
      try {
        const result = await ttsService.speak(phrase, voice);
        if (result.ok) {
          console.log(`    ✅ Success: ${result.audioUrl}`);
        } else {
          console.log(`    ❌ Failed: ${result.message}`);
        }
      } catch (err) {
        console.error(
          `    💥 Error: ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }
  }
  console.log("\n🎉 Finished pre-generating tts instructions.");
}

main().catch(console.error);
