import type { AppLocale } from "../prompts/locale";
import {
  getImageRedirectMessage,
  getPersonalDataMessage,
  getSafeRedirectMessage,
} from "../prompts/safety.system";

const personalPatterns = [
  /\b\d{9,12}\b/u,
  /địa chỉ|dia chi|số nhà|so nha|số điện thoại|so dien thoai|email|gmail|mật khẩu|mat khau|trường em|truong em/iu,
];

const unsafeWords = [
  "tự tử",
  "tu tu",
  "giết",
  "giet",
  "máu",
  "mau",
  "súng",
  "sung",
  "dao",
  "bom",
  "ma túy",
  "ma tuy",
  "sex",
  "khiêu dâm",
  "hack",
  "gian lận",
  "bắt nạt",
  "bat nat",
  "chính trị",
  "chinh tri",
];

const imageUnsafeWords = [
  ...unsafeWords,
  "người thật",
  "nguoi that",
  "ảnh thật",
  "anh that",
  "mặt em",
  "mat em",
  "deepfake",
  "kinh dị",
  "kinh di",
  "quái vật",
  "quai vat",
  "disney",
  "pokemon",
  "doraemon",
  "marvel",
  "minion",
  "elsa",
  "spider-man",
  "harry potter",
];

export interface SafetyCheck {
  message?: string;
  reason?: string;
  safe: boolean;
  status: "safe" | "redirected" | "blocked";
}

export function normalizeText(value: string) {
  return value.replace(/\s+/gu, " ").trim();
}

export class SafetyService {
  checkText(text: string, locale: AppLocale = "vi"): SafetyCheck {
    const normalized = normalizeText(text).toLowerCase();
    if (!normalized) {
      return {
        safe: false,
        status: "blocked",
        reason: "empty",
        message: getSafeRedirectMessage(locale),
      };
    }
    if (personalPatterns.some((pattern) => pattern.test(normalized))) {
      return {
        safe: false,
        status: "redirected",
        reason: "personal_data",
        message: getPersonalDataMessage(locale),
      };
    }
    const matched = unsafeWords.find((word) => normalized.includes(word));
    if (matched) {
      return {
        safe: false,
        status: "redirected",
        reason: `unsafe_keyword:${matched}`,
        message: getSafeRedirectMessage(locale),
      };
    }
    return { safe: true, status: "safe" };
  }

  checkImagePrompt(text: string, locale: AppLocale = "vi"): SafetyCheck {
    const normalized = normalizeText(text).toLowerCase();
    if (personalPatterns.some((pattern) => pattern.test(normalized))) {
      return {
        safe: false,
        status: "redirected",
        reason: "image_personal_data",
        message: getImageRedirectMessage(locale),
      };
    }
    const matched = imageUnsafeWords.find((word) => normalized.includes(word));
    if (matched) {
      return {
        safe: false,
        status: "redirected",
        reason: `image_unsafe_keyword:${matched}`,
        message: getImageRedirectMessage(locale),
      };
    }
    return { safe: true, status: "safe" };
  }
}

export const safetyService = new SafetyService();
