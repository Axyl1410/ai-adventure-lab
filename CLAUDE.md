# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

AI Adventure Lab is a self-hosted Vietnamese EdTech web app for primary students ages 6–11. It teaches AI, machine learning, prompting, Teachable Machine, image generation, and AI safety through colorful games. The app targets local/VPS/LXC Proxmox deployment with Docker, SQLite, backend-only OpenAI calls, and optional local TTS.

Default copy and UX are Vietnamese. Keep student text short, friendly, and age-appropriate.

## Commands

```bash
# Install dependencies
npm install

# Create env and generate Prisma client
cp .env.example .env
npm run prisma:generate

# Run API and web together
npm run dev

# Run one workspace
npm run dev --workspace apps/api
npm run dev --workspace apps/web

# Build all workspaces
npm run build

# Typecheck all workspaces
npm run typecheck

# Prisma
npm run prisma:migrate
npm run prisma:seed
npm run prisma:generate

# Production-like Docker run
docker compose up -d --build

# Health checks
curl http://localhost:3001/api/health
curl http://localhost/api/health
```

There are no test scripts in `package.json` yet. Use `npm run typecheck` and `npm run build` as the current verification commands.

## Architecture

Monorepo with npm workspaces:

- `apps/web`: React + Vite + TypeScript frontend.
- `apps/api`: Express + TypeScript backend.
- `packages/shared`: shared Zod schemas and TypeScript types used by both apps.
- `prisma`: SQLite schema, generated client target, and seed script.
- `nginx`: production reverse proxy; serves web and proxies `/api/` to the API service.

### Frontend

Routing is centralized in `apps/web/src/App.tsx`. All game routes are **lazy-loaded** via `React.lazy` + `Suspense` and individually wrapped in `ErrorBoundary` so a crash in one game cannot break the full app. `Layout` wraps the home page and game routes. Game modules live under `apps/web/src/games/*`:

- `ai-detective` — guess which activities use AI (easy/hard levels)
- `teach-the-robot` — label data examples to train a mini ML model
- `oops-ai-mistake` — spot AI errors and fake news
- `prompt-magic` — assemble prompt blocks (3-piece / 5-piece modes)
- `buddy-bot` — multi-turn safe chatbot powered by OpenAI
- `image-studio` — build safe image prompts and generate via AI
- `teachable-machine` — real-time browser-side KNN classifier using webcam + TensorFlow.js
- `data-sorter` — classify data cards: good data / noisy data / private info
- `ai-safety-quest` — decision-making scenarios: safe to do / not safe / ask an adult

Shared UI lives in `apps/web/src/components` and `apps/web/src/components/ui`. `GameShell` provides the common game frame; `BuddyBot`, `ErrorBoundary`, feedback components, and `TTSButton` support the child-friendly learning flow. Assets for the Rainbow Robot Classroom theme live in `apps/web/src/assets`.

The web app should call the backend for AI text, image generation, persistence, teacher actions, and TTS. Teachable Machine/webcam processing is browser-side; webcam images should not be uploaded.

### Backend

`apps/api/src/index.ts` loads environment and starts the server. `apps/api/src/server.ts` configures Helmet, CORS, JSON parsing, rate limiting, static upload serving under `/api/uploads`, and mounts `routes` under `/api`.

`apps/api/src/routes/index.ts` defines the API surface:

- Health: `GET /api/health`
- Sessions/progress/games: `/api/sessions`, `/api/progress`, `/api/games`
- AI text: `/api/ai/chat`, `/api/ai/prompt-feedback`, `/api/ai/explain`
- Images: `/api/images/generate`, `/api/images/:imageId`
- TTS: `/api/tts`
- Teacher: `/api/teacher/activities`, `/api/teacher/stats`, `/api/teacher/export.csv`, `/api/teacher/images`

Validation uses shared Zod schemas through `middleware/validate.ts`. Teacher-only endpoints use `middleware/teacherAuth.ts` and `TEACHER_PASSCODE`. General and image-specific rate limits live in `middleware/rateLimits.ts`.

Services:

- `openai.service.ts`: Buddy Bot, prompt coach, and explain flows; uses fallback behavior when OpenAI is unavailable.
- `image.service.ts`: safe image prompt building, OpenAI image generation, and local SVG fallback/storage.
- `safety.service.ts`: child-safety checks and redirect messaging.
- `tts.service.ts`: optional local TTS proxy; frontend must still show text if TTS fails.

System prompts are in `apps/api/src/prompts`. Keep prompt changes aligned with child-safety rules and Vietnamese default behavior.

### Data and storage

Prisma uses SQLite via `DATABASE_URL`. The schema includes `Session`, `GameProgress`, `PromptAttempt`, `ChatMessage`, `GeneratedImage`, and `TeacherActivity`.

Generated images are stored under `UPLOAD_DIR/generated-images` and served via `/api/uploads/generated-images/:filename`. Metadata is saved in SQLite. Do not add flows that collect real child identity data.

## Environment

Important variables from `.env.example`:

- `DATABASE_URL=file:./dev.db`
- `CORS_ORIGIN=http://localhost:5173`
- `TEACHER_PASSCODE=change-me`
- `OPENAI_API_KEY`, `OPENAI_TEXT_MODEL`, `OPENAI_IMAGE_MODEL`, `OPENAI_MODERATION_MODEL`
- `OPENAI_IMAGE_SIZE`, `OPENAI_IMAGE_QUALITY`
- `TTS_ENABLED`, `TTS_BASE_URL`, `TTS_VOICE`, `TTS_AUDIO_FORMAT`
- `RATE_LIMIT_*`, `IMAGE_RATE_LIMIT_*`
- `UPLOAD_DIR=./uploads`

Without `OPENAI_API_KEY`, Buddy Bot and Prompt Coach use local fallback responses and Image Studio creates a safe SVG fallback so the app remains usable.

## Product and safety constraints from AGENTS.md

Preserve the MVP direction from `AGENTS.md`:

- Student mode is for Vietnamese children ages 6–11: big buttons, simple text, bright rounded UI, minimal typing, encouraging feedback, TTS support.
- Teacher mode uses a simple environment passcode, not full authentication.
- Visual theme is “Rainbow Robot Classroom”: soft bright colors, rounded cards, playful robot mascot, gentle animations, no scary visuals.
- AI-generated image displays must include the label `Hình này được tạo bởi AI.` and the prompt used.
- Use guided prompt/image builders for students where possible; free-form testing belongs in teacher-oriented flows.
- Safety service must gate chat, prompt feedback, image prompt building/generation, and TTS.
- Block or redirect personal data, real children’s images/faces, violence, weapons, adult content, drugs, hate/bullying, hacking, cheating, political persuasion, dangerous instructions, copyrighted characters by name, and misleading realistic/news/deepfake-like image requests.
- Use the Vietnamese redirect message pattern already in the services/prompts when content is not appropriate.
