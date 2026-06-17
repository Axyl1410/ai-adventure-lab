import { buddyBotSystemPrompt } from "./buddyBot.system";
import { buddyBotSystemPromptEn } from "./buddyBot.system.en";
import type { AppLocale } from "./locale";
import { promptCoachSystemPrompt } from "./promptCoach.system";
import { promptCoachSystemPromptEn } from "./promptCoach.system.en";

export function getBuddyBotSystemPrompt(locale: AppLocale) {
  return locale === "en" ? buddyBotSystemPromptEn : buddyBotSystemPrompt;
}

export function getPromptCoachSystemPrompt(locale: AppLocale) {
  return locale === "en" ? promptCoachSystemPromptEn : promptCoachSystemPrompt;
}
