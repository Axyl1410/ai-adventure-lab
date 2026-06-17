import { useTranslation } from "react-i18next";
import type { AppLocale } from "@/lib/i18n";

export function useAppLocale(): AppLocale {
  const { i18n } = useTranslation();
  return i18n.language === "en" ? "en" : "vi";
}
