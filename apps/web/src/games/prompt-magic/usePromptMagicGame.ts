import { useEffect, useMemo, useRef, useState } from "react";
import { promptFeedback, unlockSticker } from "@/lib/api";
import { getDefaultSelected } from "./blockUtils";
import {
  SPARKLE_DURATION_MS,
  STICKER_ID,
  STICKER_MIN_SCORE,
} from "./constants";
import { buildPrompt } from "./promptBuilder";
import type { Level, PromptCoachResult, SelectedBlocks } from "./types";

interface SessionLike {
  id: string;
}

export function usePromptMagicGame(session: SessionLike | null) {
  const [level, setLevel] = useState<Level | null>(null);
  const [selected, setSelected] = useState<SelectedBlocks>(getDefaultSelected);
  const [result, setResult] = useState<PromptCoachResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [sparkle, setSparkle] = useState(false);
  const sparkleTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const prompt = useMemo(() => {
    if (!level) {
      return "";
    }
    return buildPrompt(level, selected);
  }, [level, selected]);

  useEffect(() => {
    setResult(null);
  }, []);

  useEffect(
    () => () => {
      if (sparkleTimerRef.current) {
        clearTimeout(sparkleTimerRef.current);
      }
    },
    []
  );

  function selectLevel(nextLevel: Level) {
    setLevel(nextLevel);
  }

  function selectBlock(key: keyof SelectedBlocks, option: string) {
    setSelected({ ...selected, [key]: option });
    setSparkle(true);
    if (sparkleTimerRef.current) {
      clearTimeout(sparkleTimerRef.current);
    }
    sparkleTimerRef.current = setTimeout(
      () => setSparkle(false),
      SPARKLE_DURATION_MS
    );
  }

  async function submit() {
    if (!(session && level)) {
      return;
    }
    setLoading(true);
    try {
      const res = await promptFeedback(session.id, prompt);
      setResult(res);
      if (res.score >= STICKER_MIN_SCORE) {
        unlockSticker(STICKER_ID);
      }
    } catch {
      // Keep silent failure behavior from original game
    }
    setLoading(false);
  }

  function resetLevel() {
    setLevel(null);
    setSelected(getDefaultSelected());
    setResult(null);
  }

  return {
    level,
    selected,
    result,
    loading,
    sparkle,
    prompt,
    selectLevel,
    selectBlock,
    submit,
    resetLevel,
  };
}
