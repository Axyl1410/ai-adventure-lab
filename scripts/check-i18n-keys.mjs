import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const localesDir = join(process.cwd(), "apps/web/src/locales");
const locales = ["vi", "en"];

function collectKeys(obj, prefix = "") {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      keys.push(...collectKeys(value, path));
    } else {
      keys.push(path);
    }
  }
  return keys.sort();
}

function loadNamespace(locale, file) {
  const raw = readFileSync(join(localesDir, locale, file), "utf8");
  return JSON.parse(raw);
}

const files = readdirSync(join(localesDir, "vi")).filter((f) =>
  f.endsWith(".json")
);
let failed = false;

for (const file of files) {
  const viKeys = collectKeys(loadNamespace("vi", file));
  const enKeys = collectKeys(loadNamespace("en", file));
  const missingEn = viKeys.filter((k) => !enKeys.includes(k));
  const missingVi = enKeys.filter((k) => !viKeys.includes(k));

  console.log(`=== ${file} ===`);
  console.log(`vi: ${viKeys.length} keys, en: ${enKeys.length} keys`);

  if (missingEn.length) {
    failed = true;
    console.error("Missing in EN:", missingEn);
  }
  if (missingVi.length) {
    failed = true;
    console.error("Missing in VI:", missingVi);
  }
  if (!(missingEn.length || missingVi.length)) {
    console.log("Keys match");
  }
}

if (failed) {
  process.exit(1);
}

console.log("\nAll locale files have matching keys.");
