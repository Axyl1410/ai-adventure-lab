import { useEffect, useState } from "react";
import { saveProgress, unlockSticker } from "@/lib/api";
import { PROGRESS_GAME_KEY, STICKER_ID, STICKER_MIN_SCORE } from "./constants";
import {
  buildFeedbackText,
  isCorrectOption,
  shuffleDeck,
} from "./recommendationUtils";
import { ALL_ROUNDS } from "./rounds";
import type { RecommendationRound } from "./types";

interface SessionLike {
  id: string;
}

export function useAiRecommendationsGame(session: SessionLike | null) {
  const [deck, setDeck] = useState<RecommendationRound[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSuccessFeedback, setIsSuccessFeedback] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDeck(shuffleDeck(ALL_ROUNDS));
  }, []);

  const current = deck[index];
  const isLastRound = deck.length > 0 && index === deck.length - 1;

  function submitOption(optionId: string) {
    if (!current || feedback) {
      return;
    }
    const correct = isCorrectOption(current, optionId);
    const nextScore = score + (correct ? 1 : 0);
    setScore(nextScore);
    setFeedback(buildFeedbackText(correct, current.explain));
    setIsSuccessFeedback(correct);

    if (isLastRound) {
      setDone(true);
      if (nextScore >= STICKER_MIN_SCORE) {
        unlockSticker(STICKER_ID);
      }
      if (session) {
        saveProgress(
          session.id,
          PROGRESS_GAME_KEY,
          nextScore,
          deck.length
        ).catch(() => undefined);
      }
    }
  }

  function goNext() {
    setFeedback("");
    setIsSuccessFeedback(false);
    setIndex((value) => Math.min(value + 1, deck.length - 1));
  }

  function dismissFeedback() {
    setFeedback("");
    setIsSuccessFeedback(false);
  }

  function restart() {
    setDeck(shuffleDeck(ALL_ROUNDS));
    setIndex(0);
    setScore(0);
    setFeedback("");
    setIsSuccessFeedback(false);
    setDone(false);
  }

  return {
    deck,
    index,
    score,
    feedback,
    isSuccessFeedback,
    done,
    current,
    submitOption,
    goNext,
    dismissFeedback,
    restart,
  };
}
