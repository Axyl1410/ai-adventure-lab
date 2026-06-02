# AGENTS.md

## Project: AI Adventure Lab

Bạn là coding agent cho **AI Adventure Lab**: app EdTech tự host giúp học sinh tiểu học Việt Nam 6–11 tuổi học AI qua trò chơi tương tác, an toàn và vui nhộn.

Mục tiêu chính:
- Tiếng Việt mặc định, có thể mở rộng English sau.
- Chạy local/VPS trong LXC Proxmox bằng Docker/Docker Compose.
- Không thu thập dữ liệu cá nhân trẻ em.
- AI là công cụ hỗ trợ học tập, có thể sai, cần kiểm tra với thầy cô/phụ huynh.

---

## Product & UX

### Student Mode
- Dành cho trẻ 6–11 tuổi.
- Nút lớn, chữ ngắn, màu tươi, ít gõ phím.
- Có TTS cho hướng dẫn quan trọng.
- Feedback khích lệ, không gây sợ hãi.
- Không hỏi tên thật, trường, địa chỉ, số điện thoại, email, ảnh cá nhân.

### Teacher Mode
- Passcode đơn giản từ env, không overbuild auth cho MVP.
- Quản lý nội dung game, prompt template, model Teachable Machine.
- Xem tiến độ đơn giản, export CSV, bật/tắt module.
- Review/xóa ảnh tạo bởi AI nếu cần.

---

## Tech Stack

Frontend:
- React, Vite, TypeScript, Tailwind CSS.
- React Router.
- Zustand hoặc React context.
- Framer Motion, Lucide React.
- `@tensorflow/tfjs` cho Teachable Machine.

Backend:
- Node.js, Express hoặc Fastify, TypeScript.
- Zod validation, Helmet, CORS whitelist, rate limit.
- OpenAI SDK backend-only.
- SQLite + Prisma hoặc Drizzle.

Deployment:
- Docker, Docker Compose, Nginx reverse proxy.
- Không cần cloud database.
- OpenAI và local TTS là dependency ngoài.

Package manager: dùng `pnpm`.

---

## Repository Structure

```txt
ai-adventure-lab/
  AGENTS.md
  README.md
  SECURITY_NOTES.md
  .env.example
  docker-compose.yml
  Dockerfile.web
  Dockerfile.api
  apps/
    web/
      index.html
      package.json
      vite.config.ts
      tailwind.config.ts
      src/
        main.tsx
        App.tsx
        routes/
        pages/
        components/
        components/ui/
        games/
        hooks/
        lib/
        styles/
        assets/
        theme/
    api/
      package.json
      tsconfig.json
      src/
        index.ts
        server.ts
        routes/
        services/
        middleware/
        prompts/
        schemas/
        db/
        utils/
  packages/shared/
  prisma/
  nginx/
```

---

## Design Theme: Rainbow Robot Classroom

Visual style:
- Bright, soft, cheerful classroom + robot lab + playground.
- Rounded cards, large icons, colorful badges, soft shadows.
- Gentle bounce/fade/slide/sparkle animations.
- No dark, scary, violent, or realistic child-face visuals.

Colors:
```css
--color-sky: #38BDF8;
--color-blue: #60A5FA;
--color-purple: #A78BFA;
--color-pink: #F472B6;
--color-yellow: #FACC15;
--color-orange: #FB923C;
--color-green: #4ADE80;
--color-mint: #5EEAD4;
--color-red-soft: #FCA5A5;
--color-cream: #FFF7ED;
--color-white: #FFFFFF;
--color-ink: #1F2937;
--color-muted: #6B7280;
```

Accessibility:
- Contrast tốt, keyboard accessible, screen-reader labels.
- Không chỉ dùng màu để báo đúng/sai.
- Game buttons tối thiểu 48px.
- Tránh flashing animation.

---

## Mascot: Buddy Bot

Tạo mascot bằng CSS/SVG nếu có thể.

Buddy Bot:
- Robot thân thiện, thân bo tròn, mắt lớn, antenna có sao.
- Accent theo rainbow palette.
- States: happy, thinking, celebrating, warning gentle, reading.
- Dùng ở home, chat, feedback, loading.

---

## Main Navigation

Home title: **Phòng Thí Nghiệm AI Vui Nhộn**

Subtitle: **Cùng Buddy Bot khám phá AI qua trò chơi, hình ảnh, giọng nói và thử thách thông minh!**

Game cards:
1. AI Detective — “Đoán xem hoạt động nào có AI.”
2. Teach the Robot — “Dạy robot học bằng ví dụ.”
3. Train Your Mini AI — “Thử model Teachable Machine.”
4. Prompt Magic — “Ghép prompt để hướng dẫn AI.”
5. Oops, AI Mistake! — “Tìm lỗi sai của AI.”
6. Buddy Bot — “Trò chuyện với robot học tập.”
7. AI Image Studio / Xưởng Tranh AI — “Tạo tranh bằng prompt an toàn.”

Each card: icon, short description, difficulty badge, start button, gradient.

---

## Game Modules

### AI Detective
- Học sinh chọn “Có AI” hoặc “Không AI”.
- Feedback ngay, giải thích ngắn bằng tiếng Việt, có TTS.
- Lưu score, random order.

Sample:
- “YouTube gợi ý video cho em.” -> Có AI.
- “Cái quạt quay khi bấm nút.” -> Không AI.
- “Google Translate dịch câu tiếng Anh.” -> Có AI.
- “Đồng hồ báo thức kêu lúc 6 giờ.” -> Không AI.

### Teach the Robot
- Dạy ML bằng ví dụ và nhãn.
- Click/drag object vào nhóm: cat, dog, apple, banana, car, ball.
- Simulate training và prediction.
- Nếu ví dụ chưa đủ, robot có thể nhầm.

### Train Your Mini AI
- Load Google Teachable Machine image model bằng URL/model files.
- Dùng webcam trong browser, không upload ảnh lên server.
- Hiển thị class, confidence bars, Start/Stop camera.
- Có mock mode khi chưa có model.
- Privacy notice: “Camera chỉ dùng trong trình duyệt để AI nhận diện. Ảnh không được gửi lên server.”

### Prompt Magic
- Học prompt qua block: vai trò, nhiệm vụ, người nghe/độ tuổi, phong cách, định dạng.
- Preview final prompt, gọi backend OpenAI, Prompt Coach chấm điểm.
- Student dùng block an toàn; Teacher Mode có thể test free prompt.

### Oops, AI Mistake!
- Học rằng AI có thể sai.
- Chọn: “Đúng”, “Sai”, “Cần kiểm tra thêm”.
- Nhắc kiểm tra với thầy cô, sách, nguồn đáng tin cậy.

### Buddy Bot
- Chat tutor an toàn, tiếng Việt, câu ngắn 3–6 câu.
- Suggested chips: “AI là gì?”, “Prompt là gì?”, “Máy học là gì?”, “Vì sao AI có thể sai?”, “Cho em một câu đố toán lớp 3.”
- Không hỏi/lưu thông tin cá nhân.
- Redirect nội dung không phù hợp.

### AI Image Studio / Xưởng Tranh AI
Purpose:
- Học rằng AI tạo ảnh từ prompt.
- Prompt tốt mô tả chủ thể, bối cảnh, style, màu, cảm xúc, mục đích.
- Mọi ảnh phải có nhãn: “Hình này được tạo bởi AI.”

Student flow:
1. Chọn theme an toàn: động vật dễ thương, robot lớp học, vũ trụ, rừng cầu vồng, đồ học tập, cổ tích không bản quyền, biển, thành phố tương lai thân thiện.
2. Chọn style: hoạt hình, màu nước, sticker, poster lớp học, sách tranh, pixel art.
3. Chọn details: subject, setting, colors, mood, includeText.
4. App tạo prompt an toàn.
5. Gọi `POST /api/images/generate`.
6. Hiển thị ảnh, prompt used, AI label, tải xuống, tạo lại, lưu thư viện, nghe mô tả, dùng để viết chuyện.

Backend:
- `apps/api/src/services/image.service.ts` adapter cho OpenAI image generation.
- Env: `OPENAI_API_KEY`, `OPENAI_IMAGE_MODEL`, `OPENAI_IMAGE_SIZE`, `OPENAI_IMAGE_QUALITY`.
- Safety check trước khi generate.
- Rate limit riêng cho image.
- Lưu ảnh local: `apps/api/uploads/generated-images/`.
- Serve qua `/api/uploads/generated-images/:filename`.
- Metadata SQLite: id, sessionId, promptUsed, theme, style, safetyLevel, filePath, label, createdAt.

Block image requests:
- Người thật/trẻ em thật/face realistic/private people.
- Thông tin cá nhân.
- Bạo lực, vũ khí, máu, kinh dị, adult, hate/bullying, chính trị, deepfake, tin giả realistic, nhân vật có bản quyền.

Redirect image message:
“Ý tưởng này chưa phù hợp cho lớp mình. Em có thể tạo tranh về robot học tập, động vật dễ thương, vũ trụ hoặc thiên nhiên nhé!”

---

## Required Prompt Files

### `apps/api/src/prompts/buddyBot.system.ts`
Buddy Bot phải:
- Trợ lý học tập cho học sinh Việt Nam 6–11 tuổi.
- Tiếng Việt mặc định, thân thiện, câu ngắn, ví dụ gần gũi.
- Giải thích AI/ML/prompt/image AI/toán/khoa học/tiếng Anh cơ bản.
- Không hỏi hoặc lưu thông tin cá nhân.
- Không làm bài thay hoàn toàn; hướng dẫn từng bước.
- Nhắc AI có thể sai và cần kiểm tra lại.
- Redirect unsafe bằng câu chuẩn ở mục Safety.

### `apps/api/src/prompts/promptCoach.system.ts`
Prompt Coach trả JSON:
```json
{
  "score": 0,
  "badges": [],
  "feedback": "",
  "improvedPrompt": ""
}
```
Chấm 4 tiêu chí: nhiệm vụ rõ, có người nghe/độ tuổi, có style/format, an toàn/lịch sự.

### `apps/api/src/prompts/imageStudio.system.ts`
Image Studio Prompt Builder trả JSON:
```json
{
  "safe": true,
  "prompt": "",
  "reason": "",
  "studentMessage": ""
}
```
Luôn tạo prompt vui vẻ, giáo dục, cartoon/sách tranh/sticker/poster, không người thật, không bản quyền, không thông tin cá nhân. Nếu unsafe: `safe=false`, `prompt=""`, chuyển hướng thân thiện.

---

## API Endpoints

Health:
- `GET /api/health`

Sessions/progress:
- `POST /api/sessions`
- `GET /api/sessions/:id`
- `GET /api/games`
- `POST /api/progress`
- `GET /api/progress/:sessionId`

AI text:
- `POST /api/ai/chat`
- `POST /api/ai/prompt-feedback`
- `POST /api/ai/explain`

Images:
- `POST /api/images/generate`
- `GET /api/images/:imageId`
- `DELETE /api/images/:imageId`

TTS:
- `POST /api/tts`

Teacher:
- `GET /api/teacher/activities`
- `POST /api/teacher/activities`
- `PUT /api/teacher/activities/:id`
- `DELETE /api/teacher/activities/:id`
- `GET /api/teacher/stats`
- `GET /api/teacher/export.csv`

---

## Data Models

Use SQLite.

Suggested models:
- `Session`: id, nickname, mode, ageGroup, createdAt, updatedAt.
- `GameProgress`: id, sessionId, gameKey, score, maxScore, metadata, createdAt.
- `PromptAttempt`: id, sessionId, rawPrompt, improvedPrompt, score, feedback, createdAt.
- `ChatMessage`: id, sessionId, role, content, safetyLevel, createdAt.
- `GeneratedImage`: id, sessionId, promptUsed, theme, style, safetyLevel, filePath, label, createdAt.
- `TeacherActivity`: id, title, type, config, createdAt, updatedAt.

Do not store real child names or personal data.

---

## Environment Variables

`.env.example` should include:
```env
NODE_ENV=development
API_PORT=3001
WEB_PORT=5173
DATABASE_URL=file:./dev.db
CORS_ORIGIN=http://localhost:5173
TEACHER_PASSCODE=change-me

OPENAI_API_KEY=
OPENAI_TEXT_MODEL=
OPENAI_IMAGE_MODEL=
OPENAI_MODERATION_MODEL=omni-moderation-latest
OPENAI_IMAGE_SIZE=1024x1024
OPENAI_IMAGE_QUALITY=medium

TTS_ENABLED=true
TTS_PROVIDER=local
TTS_BASE_URL=http://localhost:5002
TTS_VOICE=vi-female
TTS_AUDIO_FORMAT=wav

RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=30
IMAGE_RATE_LIMIT_WINDOW_MS=3600000
IMAGE_RATE_LIMIT_MAX=10
UPLOAD_DIR=./uploads
```

---

## Safety Requirements

Không hỏi/thu thập:
- Tên thật, địa chỉ, số điện thoại, email, mật khẩu, tên trường, ảnh mặt, ảnh cá nhân, liên hệ phụ huynh.

Block/redirect:
- Self-harm, violence, weapons, adult/sexual, drugs, hate/bullying, political persuasion, hacking, cheating, private data extraction, dangerous experiments, real-child images.

Safe redirect message:
“Câu hỏi này chưa phù hợp với lớp mình. Mình có thể cùng em học về AI, khoa học, tiếng Anh, toán vui hoặc tạo tranh an toàn nhé!”

Safety service:
- `apps/api/src/services/safety.service.ts`.
- Normalize input, detect unsafe keywords, call moderation when appropriate.
- Run before chat, prompt feedback, image prompt, image generation, TTS.
- Do not send blocked content to OpenAI image generation or TTS.

---

## Frontend Requirements

Global:
- Header: logo, Student/Teacher toggle, VI/EN placeholder, safety reminder.
- Home: hero + Buddy Bot, game cards, progress summary, teacher button.
- Footer: “AI có thể sai. Hãy kiểm tra với thầy cô nhé.”

Reusable:
- `GameShell`: title, subtitle, mascot, progress, score, instruction, TTS, back button.
- Feedback: happy, try again, safety redirect, badge reward, confetti, loading Buddy.
- Image Studio components: theme picker, style picker, detail builder, prompt preview, generated image card, AI label, gallery, teacher review panel.

---

## Implementation Phases

1. Foundation: monorepo, web, API, shared types, Tailwind theme, Docker, health, README.
2. UI: Rainbow Robot Classroom, Buddy Bot, game cards, shell, animations, TTS button.
3. Static games: AI Detective, Teach the Robot, Oops AI Mistake.
4. OpenAI text: service, Buddy Bot, Prompt Magic, Prompt Coach, safety.
5. Image Studio: guided builder, safety, image service, storage, AI label, teacher review/delete.
6. Teachable Machine: TFJS, webcam, model loader, prediction UI, privacy notice.
7. Teacher Mode: activities, templates, stats, CSV.
8. Deployment polish: Dockerfiles, Nginx, Proxmox notes, security notes, tests.

---

## Acceptance Criteria

MVP accepted when:
- `docker compose up -d` starts the project.
- Frontend works at `http://localhost` or dev `http://localhost:5173`.
- `GET http://localhost:3001/api/health` works.
- AI Detective, Teach the Robot, Prompt Magic, Buddy Bot, AI Image Studio work.
- Buddy Bot answers safely in Vietnamese.
- OpenAI calls happen backend-only.
- Generated images show prompt, AI label, download, teacher delete option.
- TTS works or fails gracefully.
- Teachable Machine page has model URL input, webcam UI, prediction area, mock fallback.
- UI is colorful, child-friendly, rounded, readable, responsive.
- No OpenAI key appears in frontend or git.
- README covers install, env, dev, Docker, LXC Proxmox, Nginx, TTS, OpenAI text/image, Teachable Machine, safety, troubleshooting.
- `SECURITY_NOTES.md` covers child data minimization, AI limitations, safety limits, teacher supervision.

---

## Subagent Guidance

Use subagents when useful:
- Product/Learning: child-friendly Vietnamese flow and pedagogy.
- Frontend: React/Tailwind UI, accessibility, animations.
- Backend: Express/TypeScript APIs, Zod, OpenAI/TTS/SQLite.
- Safety/Privacy: prompts, safety service, image/TTS/chat guardrails.
- AI Integration: OpenAI adapters, structured JSON, fallbacks.
- Data/Prisma: schema, seed, shared types.
- Testing/QA: typecheck, tests, browser validation, safety cases.
- DevOps: Docker, Nginx, LXC, ports, uploads, env.
- Docs: README, SECURITY_NOTES, AGENTS updates.

Subagent handoff template:
```md
Role:
Goal:
Files in scope:
Constraints:
- Vietnamese-first, child-friendly, ages 6–11.
- No collection of personal child data.
- Backend-only secrets.
- Graceful fallback when OpenAI/TTS is unavailable.
Expected output:
- Summary.
- Files changed/reviewed.
- Verification.
- Risks/follow-up.
```

---

## Coding Rules

- Build working MVP, not placeholder-only code.
- Prefer simple maintainable code over over-engineering.
- Strict TypeScript.
- Zod validation for API inputs.
- Backend-only secrets.
- Never require child accounts.
- Do not store real child names.
- Graceful fallbacks for OpenAI/TTS/API failures.
- Vietnamese default copy; keep child-facing text short.
- Comment safety-sensitive logic.
- Reuse components and keep folder structure clean.
- Make adding new games easy.


# Ultracite Code Standards

This project uses **Ultracite**, a zero-config preset that enforces strict code quality standards through automated formatting and linting.

## Quick Reference

- **Format code**: `pnpm dlx ultracite fix`
- **Check for issues**: `pnpm dlx ultracite check`
- **Diagnose setup**: `pnpm dlx ultracite doctor`

Biome (the underlying engine) provides robust linting and formatting. Most issues are automatically fixable.

---

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers - extract constants with descriptive names

### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`

### Async & Promises

- Always `await` promises in async functions - don't forget to use the return value
- Use `async/await` syntax instead of promise chains for better readability
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors

### React & JSX

- Use function components over class components
- Call hooks at the top level only, never conditionally
- Specify all dependencies in hook dependency arrays correctly
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices)
- Nest children between opening and closing tags instead of passing as props
- Don't define components inside other components
- Use semantic HTML and ARIA attributes for accessibility:
  - Provide meaningful alt text for images
  - Use proper heading hierarchy
  - Add labels for form inputs
  - Include keyboard event handlers alongside mouse events
  - Use semantic elements (`<button>`, `<nav>`, etc.) instead of divs with roles

### Error Handling & Debugging

- Remove `console.log`, `debugger`, and `alert` statements from production code
- Throw `Error` objects with descriptive messages, not strings or other values
- Use `try-catch` blocks meaningfully - don't catch errors just to rethrow them
- Prefer early returns over nested conditionals for error cases

### Code Organization

- Keep functions focused and under reasonable cognitive complexity limits
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting
- Prefer simple conditionals over nested ternary operators
- Group related code together and separate concerns

### Security

- Add `rel="noopener"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`
- Validate and sanitize user input

### Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Prefer specific imports over namespace imports
- Avoid barrel files (index files that re-export everything)
- Use proper image components (e.g., Next.js `<Image>`) over `<img>` tags

### Framework-Specific Guidance

**Next.js:**
- Use Next.js `<Image>` component for images
- Use `next/head` or App Router metadata API for head elements
- Use Server Components for async data fetching instead of async Client Components

**React 19+:**
- Use ref as a prop instead of `React.forwardRef`

**Solid/Svelte/Vue/Qwik:**
- Use `class` and `for` attributes (not `className` or `htmlFor`)

---

## Testing

- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks in async tests - use async/await instead
- Don't use `.only` or `.skip` in committed code
- Keep test suites reasonably flat - avoid excessive `describe` nesting

## When Biome Can't Help

Biome's linter will catch most issues automatically. Focus your attention on:

1. **Business logic correctness** - Biome can't validate your algorithms
2. **Meaningful naming** - Use descriptive names for functions, variables, and types
3. **Architecture decisions** - Component structure, data flow, and API design
4. **Edge cases** - Handle boundary conditions and error states
5. **User experience** - Accessibility, performance, and usability considerations
6. **Documentation** - Add comments for complex logic, but prefer self-documenting code

---

Most formatting and common issues are automatically fixed by Biome. Run `pnpm dlx ultracite fix` before committing to ensure compliance.
