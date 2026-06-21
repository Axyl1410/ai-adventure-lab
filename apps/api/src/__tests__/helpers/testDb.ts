import fs from "node:fs/promises";
import path from "node:path";
import { afterAll, beforeAll, beforeEach } from "vitest";
import { prisma } from "../../db/client";
import { ensureDatabase } from "../../db/ensureDatabase";

const TEST_DB_PATH = path.resolve(".test.db");
const TEST_UPLOADS = path.resolve(".test-uploads");

export async function initTestDatabase() {
  await prisma.$disconnect().catch(() => undefined);
  await fs.unlink(TEST_DB_PATH).catch(() => undefined);
  await fs
    .rm(TEST_UPLOADS, { recursive: true, force: true })
    .catch(() => undefined);
  await ensureDatabase();
}

export async function resetTestDatabase() {
  await prisma.chatMessage.deleteMany();
  await prisma.promptAttempt.deleteMany();
  await prisma.generatedImage.deleteMany();
  await prisma.gameProgress.deleteMany();
  await prisma.teacherActivity.deleteMany();
  await prisma.session.deleteMany();
}

export async function teardownTestDatabase() {
  await prisma.$disconnect();
  await fs
    .rm(TEST_UPLOADS, { recursive: true, force: true })
    .catch(() => undefined);
  await fs.unlink(TEST_DB_PATH).catch(() => undefined);
}

export function useTestDatabase() {
  beforeAll(async () => {
    await initTestDatabase();
  });

  beforeEach(async () => {
    await resetTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });
}
