import { useEffect, useState } from "react";
import { saveProgress, unlockSticker } from "@/lib/api";
import { PROGRESS_GAME_KEY, STICKER_ID, STICKER_MIN_SCORE } from "./constants";
import { ALL_ITEMS } from "./items";
import { buildFeedbackText, shuffleDeck } from "./sorterUtils";
import type { Category, SorterCard } from "./types";

interface SessionLike {
  id: string;
}

export function useDataSorterGame(session: SessionLike | null) {
  const [deck, setDeck] = useState<SorterCard[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDeck(shuffleDeck(ALL_ITEMS));
  }, []);

  const current = deck[index];

  function submitCategory(category: Category) {
    if (!current || feedback) {
      return;
    }
    const correct = category === current.category;
    const nextScore = score + (correct ? 1 : 0);
    setScore(nextScore);
    setFeedback(buildFeedbackText(correct, current.explain));

    if (index === deck.length - 1) {
      setDone(true);
      if (nextScore >= STICKER_MIN_SCORE) {
        unlockSticker(STICKER_ID);
      }
      if (session) {
        void saveProgress(
          session.id,
          PROGRESS_GAME_KEY,
          nextScore,
          deck.length
        );
      }
    }
  }

  function goNext() {
    setFeedback("");
    setIndex((value) => Math.min(value + 1, deck.length - 1));
  }

  function restart() {
    setDeck(shuffleDeck(ALL_ITEMS));
    setIndex(0);
    setScore(0);
    setFeedback("");
    setDone(false);
  }

  return {
    deck,
    index,
    score,
    feedback,
    done,
    current,
    submitCategory,
    goNext,
    restart,
  };
}
