import { Loader2, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useGameTtsKey } from "@/context/GameTtsContext";
import {
  interruptTtsOnTabChange,
  isTtsAutoplayEnabled,
  scheduleGameContentAutoplay,
  scheduleGameInstructionAutoplay,
} from "@/lib/gameTtsAutoplay";
import { stopAllTts } from "@/lib/stopAllTts";
import {
  getTtsPlayState,
  isTtsLoadingText,
  isTtsPlayingText,
  playTts,
  resetTtsBackendCache,
  subscribeTtsState,
} from "@/lib/ttsPlayer";

export type TtsAutoPlayRole = "instruction" | "content" | "immediate";

export function TTSButton({
  text,
  compact,
  autoPlay,
  autoPlayRole = "immediate",
}: {
  text: string;
  compact?: boolean;
  autoPlay?: boolean;
  /** instruction: once per game visit; content: after instruction; immediate: on its own */
  autoPlayRole?: TtsAutoPlayRole;
}) {
  const gameKey = useGameTtsKey();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const contentAutoplayedRef = useRef(false);
  const immediateAutoplayedRef = useRef(false);

  useEffect(() => {
    const sync = () => {
      setIsPlaying(isTtsPlayingText(text));
      setIsLoading(isTtsLoadingText(text));
    };

    const unsubscribe = subscribeTtsState(sync);
    return unsubscribe;
  }, [text]);

  useEffect(() => {
    const onGenderChange = () => {
      resetTtsBackendCache();
    };
    window.addEventListener("tts-gender-changed", onGenderChange);
    return () =>
      window.removeEventListener("tts-gender-changed", onGenderChange);
  }, []);

  useEffect(() => {
    if (!(autoPlay && isTtsAutoplayEnabled() && text.trim())) {
      return;
    }

    const timer = setTimeout(
      () => {
        if (autoPlayRole === "instruction" && gameKey) {
          scheduleGameInstructionAutoplay(gameKey, text);
          return;
        }
        if (autoPlayRole === "content") {
          scheduleGameContentAutoplay(text, contentAutoplayedRef.current);
          contentAutoplayedRef.current = true;
          return;
        }
        void playTts(text, { replacePending: immediateAutoplayedRef.current });
        immediateAutoplayedRef.current = true;
      },
      autoPlayRole === "content" ? 550 : 500
    );

    return () => {
      clearTimeout(timer);
      interruptTtsOnTabChange();
    };
  }, [text, autoPlay, autoPlayRole, gameKey]);

  const onSpeak = () => {
    if (isPlaying || isLoading) {
      stopAllTts();
      return;
    }
    const busyElsewhere = getTtsPlayState() !== "idle";
    if (busyElsewhere) {
      stopAllTts();
    }
    void playTts(text, { replacePending: busyElsewhere });
  };

  return (
    <button
      aria-label="Nghe nội dung"
      className={
        compact
          ? `grid h-11 w-11 shrink-0 place-items-center rounded-full text-white shadow-sm transition-all hover:scale-105 active:scale-100 ${isPlaying ? "bg-pinkLab" : "bg-skyLab"}`
          : `big-button text-white transition-all ${isPlaying ? "bg-pinkLab" : "bg-skyLab"}`
      }
      onClick={onSpeak}
      type="button"
    >
      {isLoading ? (
        <Loader2
          className={
            compact
              ? "h-5 w-5 animate-spin"
              : "mr-2 inline h-5 w-5 animate-spin"
          }
        />
      ) : (
        <Volume2 className={compact ? "h-5 w-5" : "mr-2 inline h-5 w-5"} />
      )}
      {!compact && (isLoading ? "Đang tải..." : isPlaying ? "Dừng" : "Nghe")}
    </button>
  );
}
