import { useEffect, useMemo, useRef, useState } from "react";
import { api, unlockSticker } from "../../lib/api";
import {
  DEFAULT_DETAILS,
  DEFAULT_STYLE,
  DEFAULT_THEME,
  GENERATE_ERROR_FALLBACK,
  STICKER_ID,
} from "./constants";
import { loadGallery, prependToGallery, saveGallery } from "./galleryStorage";
import { buildStudentPrompt } from "./promptBuilder";
import type { GeneratedImage, ImageDetails } from "./types";

interface SessionLike {
  id: string;
}

export function useImageStudio(session: SessionLike | null) {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [style, setStyle] = useState(DEFAULT_STYLE);
  const [details, setDetails] = useState<ImageDetails>(DEFAULT_DETAILS);
  const [image, setImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [gallery, setGallery] = useState<GeneratedImage[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  const prompt = useMemo(
    () => buildStudentPrompt(theme, style, details),
    [theme, style, details]
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
      const result = await api<GeneratedImage>("/api/images/generate", {
        method: "POST",
        body: JSON.stringify({
          sessionId: session.id,
          theme,
          style,
          details,
          ageGroup: "6-8",
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
      setError(err instanceof Error ? err.message : GENERATE_ERROR_FALLBACK);
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
