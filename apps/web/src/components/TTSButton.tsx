import { Loader2, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  isTtsLoadingText,
  isTtsPlayingText,
  playTts,
  resetTtsBackendCache,
  stopTts,
  subscribeTtsState,
} from "../lib/ttsPlayer";

export function TTSButton({
  text,
  compact,
  autoPlay,
}: {
  text: string;
  compact?: boolean;
  autoPlay?: boolean;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const hasAutoplayedRef = useRef(false);

  useEffect(() => {
    const autoplayEnabled =
      localStorage.getItem("ai-lab-tts-autoplay") === "true";
    if (!(autoPlay && autoplayEnabled && text.trim())) {
      return;
    }

    // Lần đầu vào màn hình: xếp hàng tuần tự (hướng dẫn rồi câu hỏi).
    // Khi text đổi (câu mới): hủy các câu đang chờ, chỉ đọc nội dung mới.
    const replacePending = hasAutoplayedRef.current;
    hasAutoplayedRef.current = true;

    const timer = setTimeout(() => {
      void playTts(text, { replacePending });
    }, 500);

    return () => clearTimeout(timer);
  }, [text, autoPlay]);

  const onSpeak = () => {
    if (isPlaying || isLoading) {
      stopTts();
      return;
    }
    void playTts(text);
  };

  return (
    <button
      aria-label="Nghe nội dung"
      className={
        compact
          ? `grid h-11 w-11 shrink-0 place-items-center rounded-full text-white shadow-sm transition-all hover:scale-105 active:scale-100 ${isPlaying ? "bg-pinkLab" : "bg-skyLab"}`
          : `big-button text-white transition-all ${isPlaying ? "bg-pinkLab" : "bg-skyLab"}`
      }
      disabled={isLoading}
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
