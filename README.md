# AI Adventure Lab

Ứng dụng web tự host giúp học sinh tiểu học Việt Nam học về AI qua trò chơi, Buddy Bot, Prompt Magic, Teachable Machine và Xưởng Tranh AI.

## Tính năng

- Giao diện tiếng Việt, màu sắc, thân thiện với học sinh 6-11 tuổi.
- Game: AI Detective, Teach the Robot, Oops AI Mistake, Prompt Magic, Buddy Bot, AI Image Studio, Train Your Mini AI, Data Sorter, AI Safety Quest.
- Backend Express TypeScript, SQLite/Prisma, Zod validation, Helmet, CORS, rate limit.
- OpenAI text/image chỉ gọi từ backend, không lộ API key ở frontend.
- TTS local qua `TTS_BASE_URL`, lỗi thì frontend vẫn hiển thị chữ.
- Teacher Mode bằng passcode đơn giản, quản lý hoạt động, thống kê, CSV export, xem/xóa ảnh.

## Screenshots

Thêm ảnh chụp màn hình sau khi triển khai thực tế.

## Yêu cầu

- Node.js 20+
- npm 10+
- Docker và Docker Compose nếu chạy production
- SQLite dùng qua Prisma
- OpenAI API key nếu muốn dùng AI thật
- TTS server local nếu muốn nghe giọng đọc

## Cấu hình môi trường

```bash
cp .env.example .env
```

Các biến quan trọng:

- `DATABASE_URL=file:./dev.db`
- `TEACHER_PASSCODE=change-me`
- `OPENAI_API_KEY=`
- `OPENAI_TEXT_MODEL=`
- `OPENAI_IMAGE_MODEL=gpt-image-1`
- `OPENAI_IMAGE_SIZE=1024x1024`
- `OPENAI_IMAGE_QUALITY=medium`
- `TTS_BASE_URL=http://localhost:5002`

Nếu không có `OPENAI_API_KEY`, Buddy Bot và Prompt Coach dùng fallback local, Image Studio tạo ảnh SVG minh họa an toàn để app vẫn chạy được.

## Chạy dev

```bash
pnpm install
pnpm prisma:generate
pnpm dev
```

- Web: `http://localhost:5173`
- API health: `http://localhost:3001/api/health`
- API tự tạo các bảng SQLite còn thiếu khi khởi động.

## Ngôn ngữ (i18n)

- Mặc định tiếng Việt; nút **VI / EN** trên header đổi ngôn ngữ (lưu trong `localStorage`).
- File dịch: `apps/web/src/locales/{vi,en}/*.json` (`common`, `layout`, `home`, `games`, `gameContent`).
- Kiểm tra khớp key vi/en: `pnpm i18n:check`
- Buddy Bot, Prompt Coach và Image Studio gửi `locale` lên API khi bật EN.
- TTS vẫn dùng giọng tiếng Việt (`TTS_VOICE=vi-female`); chế độ EN có thể đọc text tiếng Anh bằng engine hiện tại hoặc bỏ qua nhẹ nhàng.

## Chạy Docker

```bash
cp .env.example .env
docker compose up -d --build
```

- Web qua Nginx: `http://localhost`
- API: `http://localhost:3001/api/health`

## Triển khai trong LXC Proxmox

1. Tạo LXC Ubuntu/Debian có quyền chạy Docker.
2. Cài Docker Engine và Docker Compose plugin.
3. Copy source vào container, ví dụ `/opt/ai-adventure-lab`.
4. Tạo `.env`, cấu hình `TEACHER_PASSCODE`, OpenAI và TTS.
5. Chạy `docker compose up -d --build`.
6. Trỏ reverse proxy ngoài vào port 80 của container.

## Nginx reverse proxy

File `nginx/default.conf` phục vụ frontend và proxy `/api/` sang API service. Nếu đặt sau reverse proxy khác, bật HTTPS ở reverse proxy ngoài và chuyển tiếp `Host`, `X-Forwarded-*`.

## Cấu hình TTS local

Mặc định:

```env
TTS_ENABLED=true
TTS_PROVIDER=local
TTS_BASE_URL=http://localhost:5002
TTS_VOICE=vi-female
TTS_AUDIO_FORMAT=wav
```

API gọi `POST {TTS_BASE_URL}/tts` với JSON `{ text, voice, format }`. Nếu server TTS khác format, chỉnh `apps/api/src/services/tts.service.ts`.

## Cấu hình OpenAI text

```env
OPENAI_API_KEY=sk-...
OPENAI_TEXT_MODEL=gpt-4o-mini
OPENAI_MODERATION_MODEL=omni-moderation-latest
```

Prompt files nằm trong `apps/api/src/prompts/`.

## Cấu hình OpenAI image

```env
OPENAI_IMAGE_MODEL=gpt-image-1
OPENAI_IMAGE_SIZE=1024x1024
OPENAI_IMAGE_QUALITY=medium
```

Ảnh tạo ra lưu local trong `UPLOAD_DIR/generated-images` và được serve qua `/api/uploads/generated-images/:filename`.

## Thêm Teachable Machine model

1. Export model từ Google Teachable Machine.
2. Host thư mục model để trình duyệt truy cập được.
3. Nhập URL kết thúc bằng `model.json` vào game Train Your Mini AI.
4. Ảnh webcam chỉ xử lý ở trình duyệt, không upload lên server.

## Ghi chú an toàn

- Không yêu cầu học sinh tạo tài khoản.
- Không hỏi tên thật, địa chỉ, số điện thoại, email, trường học, mật khẩu hoặc ảnh cá nhân.
- Nội dung nhạy cảm được chặn/chuyển hướng bằng `safety.service.ts`.
- Tất cả ảnh AI phải hiện nhãn “Hình này được tạo bởi AI.”

## Troubleshooting

- API không chạy: kiểm tra `DATABASE_URL` và quyền ghi thư mục chứa SQLite.
- Web không gọi API: kiểm tra `CORS_ORIGIN` và Vite proxy.
- Image Studio không gọi OpenAI: kiểm tra `OPENAI_API_KEY`, model, quota và organization verification nếu dùng GPT Image.
- TTS không có âm thanh: kiểm tra `TTS_BASE_URL`, endpoint `/tts`, firewall giữa container và host.

## Cải tiến tiếp theo

- Tích hợp đầy đủ Teachable Machine prediction loop.
- Teacher approval before display cho ảnh.
- Moderation model call bổ sung ngoài keyword filter.
- Hỗ trợ tiếng Anh.
- Test tự động cho API và UI.
