import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enCommon from "@/locales/en/common.json";
import enGameContent from "@/locales/en/gameContent.json";
import enGames from "@/locales/en/games.json";
import enHome from "@/locales/en/home.json";
import enLayout from "@/locales/en/layout.json";
import viCommon from "@/locales/vi/common.json";
import viGameContent from "@/locales/vi/gameContent.json";
import viGames from "@/locales/vi/games.json";
import viHome from "@/locales/vi/home.json";
import viLayout from "@/locales/vi/layout.json";

export const LOCALE_STORAGE_KEY = "ai-lab-locale";

export const SUPPORTED_LOCALES = ["vi", "en"] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

function readSavedLocale(): AppLocale {
  if (typeof localStorage === "undefined") {
    return "vi";
  }
  const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
  return saved === "en" ? "en" : "vi";
}

void i18n.use(initReactI18next).init({
  resources: {
    vi: {
      common: viCommon,
      layout: viLayout,
      home: viHome,
      games: viGames,
      gameContent: viGameContent,
    },
    en: {
      common: enCommon,
      layout: enLayout,
      home: enHome,
      games: enGames,
      gameContent: enGameContent,
    },
  },
  lng: readSavedLocale(),
  fallbackLng: "vi",
  defaultNS: "common",
  interpolation: { escapeValue: false },
});

function syncDocumentLocale(lng: string) {
  document.documentElement.lang = lng;
  localStorage.setItem(LOCALE_STORAGE_KEY, lng);
  const title =
    lng === "en" ? "Fun AI Adventure Lab" : "Phòng Thí Nghiệm AI Vui Nhộn";
  document.title = title;
}

i18n.on("languageChanged", syncDocumentLocale);

syncDocumentLocale(i18n.language);

export default i18n;
