import { useEffect, useState } from "react";

const STORAGE_KEY = "ai-lab-unlocked-stickers";

export function useUnlockedStickers() {
  const [unlockedStickers, setUnlockedStickers] = useState<string[]>([]);

  useEffect(() => {
    const loadStickers = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        return;
      }
      try {
        setUnlockedStickers(JSON.parse(saved));
      } catch {
        setUnlockedStickers([]);
      }
    };

    loadStickers();
    window.addEventListener("sticker-unlocked", loadStickers);
    return () => window.removeEventListener("sticker-unlocked", loadStickers);
  }, []);

  return unlockedStickers;
}
