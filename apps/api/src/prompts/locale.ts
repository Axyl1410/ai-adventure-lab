export type AppLocale = "vi" | "en";

export function normalizeLocale(value: unknown): AppLocale {
  return value === "en" ? "en" : "vi";
}
