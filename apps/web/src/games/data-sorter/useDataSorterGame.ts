import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { saveProgress, unlockSticker } from "@/lib/api";
import { localizeSorterCard } from "@/lib/gameContent";
import { PROGRESS_GAME_KEY, STICKER_ID, STICKER_MIN_SCORE } from "./constants";
import { ALL_ITEMS } from "./items";
import { buildFeedbackText, shuffleDeck } from "./sorterUtils";
import type { CategoryId, SorterCard } from "./types";

interface SessionLike {
  id: string;
}

export function useDataSorterGame(session: SessionLike | null) {
  const { t, i18n } = useTranslation("gameContent");
  const [deck, setDeck] = useState<SorterCard[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [feedbackCorrect, setFeedbackCorrect] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const base = shuffleDeck(ALL_ITEMS);
    setDeck(base.map((card) => localizeSorterCard(t, card)));
  }, [i18n.language, t]);

  const current = deck[index];

  function submitCategory(category: CategoryId) {
    if (!current || feedback) {
      return;
    }
    const correct = category === current.category;
    const nextScore = score + (correct ? 1 : 0);
    setScore(nextScore);
    setFeedbackCorrect(correct);
    setFeedback(buildFeedbackText(t, correct, current.explain));

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
    setFeedbackCorrect(false);
    setIndex((value) => Math.min(value + 1, deck.length - 1));
  }

  function restart() {
    const base = shuffleDeck(ALL_ITEMS);
    setDeck(base.map((card) => localizeSorterCard(t, card)));
    setIndex(0);
    setScore(0);
    setFeedback("");
    setFeedbackCorrect(false);
    setDone(false);
  }

  return {
    deck,
    index,
    score,
    feedback,
    feedbackCorrect,
    done,
    current,
    submitCategory,
    goNext,
    restart,
  };
}
