import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { api, getApiLocale, unlockSticker } from "@/lib/api";
import {
  imageSettingValue,
  imageSubjectValue,
  resolveImageDetails,
} from "@/lib/gameContent";
import {
  DEFAULT_DETAILS,
  DEFAULT_STYLE,
  DEFAULT_THEME,
  GENERATE_ERROR_FALLBACK_KEY,
  STICKER_ID,
} from "./constants";
import { loadGallery, prependToGallery, saveGallery } from "./galleryStorage";
import { buildStudentPrompt } from "./promptBuilder";
import type {
  GeneratedImage,
  ImageDetails,
  ImageStyleId,
  ImageThemeId,
} from "./types";

interface SessionLike {
  id: string;
}

function buildDefaultDetails(
  t: ReturnType<typeof useTranslation>["t"]
): ImageDetails {
  return {
    ...DEFAULT_DETAILS,
    subject: imageSubjectValue(t, DEFAULT_DETAILS.subjectId),
    setting: imageSettingValue(t, DEFAULT_DETAILS.settingId),
  };
}

export function useImageStudio(session: SessionLike | null) {
  const { t, i18n } = useTranslation("gameContent");
  const [theme, setTheme] = useState<ImageThemeId>(DEFAULT_THEME);
  const [style, setStyle] = useState<ImageStyleId>(DEFAULT_STYLE);
  const [details, setDetails] = useState<ImageDetails>(() =>
    buildDefaultDetails(t)
  );
  const [image, setImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [gallery, setGallery] = useState<GeneratedImage[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDetails((current) => ({
      ...current,
      subject:
        current.subjectId === "custom"
          ? current.subject
          : imageSubjectValue(t, current.subjectId),
      setting:
        current.settingId === "custom"
          ? current.setting
          : imageSettingValue(t, current.settingId),
    }));
  }, [i18n.language, t]);

  const prompt = useMemo(
    () => buildStudentPrompt(t, theme, style, details),
    [theme, style, details, t, i18n.language]
  );

  useEffect(() => {
    setGallery(loadGallery());
  }, []);

  async function generate() {
    if (!session) {
      return;
    }
    setError("");
    setLoading(true);
    try {
      const resolved = resolveImageDetails(t, details);
      const result = await api<GeneratedImage>("/api/images/generate", {
        method: "POST",
        body: JSON.stringify({
          sessionId: session.id,
          theme,
          style,
          details: {
            subject: resolved.subject,
            setting: resolved.setting,
            colors: details.colors,
            mood: details.mood,
            includeText: details.includeText,
          },
          ageGroup: "6-8",
          locale: getApiLocale(),
        }),
      });
      setImage(result);

      setGallery((current) => {
        const updatedGallery = prependToGallery(current, result);
        saveGallery(updatedGallery);
        return updatedGallery;
      });

      unlockSticker(STICKER_ID);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t(GENERATE_ERROR_FALLBACK_KEY)
      );
    } finally {
      setLoading(false);
    }
  }

  return {
    theme,
    setTheme,
    style,
    setStyle,
    details,
    setDetails,
    image,
    error,
    loading,
    gallery,
    prompt,
    generate,
    resultRef,
  };
}
