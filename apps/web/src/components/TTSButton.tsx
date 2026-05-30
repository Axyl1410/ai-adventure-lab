import { useEffect, useState, useRef, useCallback } from "react";
import { Volume2, Loader2 } from "lucide-react";
import { speak } from "../lib/api";

// Module-level variables to track active playing audio across all TTSButtons and prevent overlap
let activeAudio: HTMLAudioElement | null = null;
let stopActiveAudio: (() => void) | null = null;

export function TTSButton({ text, compact, autoPlay }: { text: string; compact?: boolean; autoPlay?: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const onSpeak = useCallback(async () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      return;
    }

    // Stop any other active playing audio before starting ours
    if (stopActiveAudio) {
      stopActiveAudio();
    }

    setIsLoading(true);
    const gender = localStorage.getItem("ai-lab-tts-gender") || "female";
    // Mapping to fast Piper ONNX voices: female -> ngochuyen, male -> minhkhang
    const voice = gender === "male" ? "minhkhang" : "ngochuyen";

    try {
      const result = await speak(text, voice);
      setIsLoading(false);
      if (result?.audioUrl) {
        const audio = new Audio(result.audioUrl);
        audioRef.current = audio;
        activeAudio = audio;
        stopActiveAudio = () => {
          audio.pause();
          audio.currentTime = 0;
          setIsPlaying(false);
        };

        setIsPlaying(true);
        audio.play().catch(() => setIsPlaying(false));
        audio.onended = () => {
          setIsPlaying(false);
          if (activeAudio === audio) {
            activeAudio = null;
            stopActiveAudio = null;
          }
        };
      }
    } catch {
      setIsLoading(false);
    }
  }, [text, isPlaying]);

  // Handle autoplay if enabled
  useEffect(() => {
    const autoplayEnabled = localStorage.getItem("ai-lab-tts-autoplay") === "true";
    if (autoPlay && autoplayEnabled && text) {
      const timer = setTimeout(() => {
        void onSpeak();
      }, 500); // 500ms delay to let the page or content transitions settle
      return () => clearTimeout(timer);
    }
  }, [text, autoPlay, onSpeak]);

  // Stop playing if text changes or component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [text]);

  return (
    <button 
      className={compact 
        ? `grid h-11 w-11 place-items-center rounded-full text-white shadow-sm transition-all hover:scale-105 active:scale-100 ${isPlaying ? "bg-pinkLab" : "bg-skyLab"}`
        : `big-button text-white transition-all ${isPlaying ? "bg-pinkLab" : "bg-skyLab"}`
      }
      onClick={onSpeak} 
      disabled={isLoading}
      aria-label="Nghe nội dung"
    >
      {isLoading ? (
        <Loader2 className={compact ? "h-5 w-5 animate-spin" : "mr-2 inline h-5 w-5 animate-spin"} />
      ) : (
        <Volume2 className={compact ? "h-5 w-5" : "mr-2 inline h-5 w-5"} />
      )}
      {!compact && (isLoading ? "Đang tải..." : isPlaying ? "Dừng" : "Nghe")}
    </button>
  );
}
