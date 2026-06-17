---
name: ai-adventure-lab
description: >-
  Workflows and pitfalls for the AI Adventure Lab monorepo (Vietnamese EdTech,
  pnpm 11, React/Vite, Express, Prisma, Ultracite/Biome, lefthook, child safety).
  Use when editing this repo, adding games/API routes, fixing dev setup, TTS,
  OpenAI integration, Docker, or when AGENTS.md context is needed.
---

# AI Adventure Lab

Read `AGENTS.md` for product requirements. This skill covers repo-specific mechanics.

## Stack

| Area | Path | Notes |
|------|------|-------|
| Web | `apps/web` | React, Vite, Tailwind, lazy game routes |
| API | `apps/api` | Express, Zod, Prisma, OpenAI/TTS/images |
| Shared | `packages/shared` | Zod schemas + types |
| DB | `prisma/` | SQLite; `@prisma/client` also at repo root |
| Proxy | `nginx/` | Prod: web + `/api/` |

**Package manager:** `pnpm` only (not npm). Node 20+.

## Commands

```bash
pnpm install
pnpm prisma:generate
pnpm dev          # API :3001 + web :5173
pnpm build
pnpm typecheck
pnpm test
pnpm check        # ultracite / biome
pnpm fix
docker compose up -d --build
```

## Language conventions

- **Student/teacher UI copy:** Vietnamese default, English via i18n (`react-i18next`).
- **Locale files:** `apps/web/src/locales/{vi,en}/*.json` — namespaces: `common`, `layout`, `home`, `games`, `gameContent`.
- **Toggle:** header VI/EN; persisted in `localStorage` key `ai-lab-locale`.
- **New UI strings:** add keys to both `vi` and `en` JSON; run `pnpm i18n:check` to verify key parity.
- **Game shell copy:** `games.json` keys per game (`aiDetective`, `robotCommands`, …).
- **Game content:** questions, buttons, blocks → `gameContent.json`; use stable IDs in `gameData.ts`, localize via `useTranslation("gameContent")` and helpers in `apps/web/src/lib/gameContent.ts`.
- **API locale:** web sends `locale: "vi" | "en"` on `/api/ai/chat`, `/api/ai/prompt-feedback`, `/api/images/generate` (Zod `localeSchema` in shared).
- **TTS:** Vietnamese voice by default; EN UI may still use VI TTS or fail gracefully — no separate EN TTS in MVP.
- **Code comments:** English.
- **Secrets:** backend-only; never in frontend or git.

## pnpm 11 — build scripts

pnpm blocks postinstall by default. Allowed packages live in `pnpm-workspace.yaml` → `allowBuilds`.

When adding a dependency with install scripts (native binaries, hooks):

```yaml
allowBuilds:
  new-package: true
```

Then `pnpm install`. Do not rely on `pnpm approve-builds --all` on all versions.

## Prisma

- Schema: `prisma/schema.prisma`
- Import: `import { PrismaClient } from "@prisma/client"` (not deep paths into `.pnpm`)
- Root `package.json` includes `@prisma/client` because schema is at repo root

## New game (web)

1. Folder under `apps/web/src/games/<name>/`
2. Lazy import in `App.tsx` + route
3. Wrap in `ErrorBoundary`; use `GameShell` for frame
4. Card on `HomePage.tsx`; optional entry in `apps/api/src/routes/gameData.ts`
5. TTS static phrases → `apps/api/src/services/tts.service.ts` `staticPhrases`

## New API behavior

1. Zod schema in `packages/shared` or `apps/api/src/schemas/`
2. Run `safety.service.ts` before OpenAI/TTS/image generation
3. Route in `apps/api/src/routes/index.ts`; use `ah()` async wrapper
4. No child PII in logs or DB

## TTS (web)

- Global queue: `apps/web/src/lib/ttsPlayer.ts` — one playback at a time
- `TTSButton` uses `playTts()`; do not spawn parallel `/api/tts` calls
- Backend cache: `uploads/tts-cache/`; slow first hit if external ViTTS is remote

## Lint / format

- Config: `biome.jsonc` extends Ultracite
- Pre-commit: `lefthook.yml` runs `pnpm fix || true` (non-blocking while codebase is large)
- Skip hooks: `git commit --no-verify` or `LEFTHOOK=0`

## Git hooks on Windows paths with spaces/parentheses

`lefthook install` embeds unquoted absolute paths → bash syntax error (e.g. `Archive (2)`).

Use the wrapper instead:

```bash
node scripts/install-git-hooks.mjs
```

`package.json` `prepare` runs this script. **Do not** run bare `lefthook install` on this machine unless you re-run the wrapper after.

## Safety checklist (always)

- No real child names, schools, addresses, phone, email, photos
- Block/redirect unsafe chat, prompts, images per `safety.service.ts`
- Generated images: AI label in UI; stored under `uploads/generated-images/`

## Verification before done

```bash
pnpm typecheck
pnpm build   # if touching build paths
pnpm test    # if touching API/shared tests
```

## See also

- `AGENTS.md` — product, games, prompts, acceptance criteria
- `SECURITY_NOTES.md` — privacy and AI limits
- `README.md` — install, env, Docker
