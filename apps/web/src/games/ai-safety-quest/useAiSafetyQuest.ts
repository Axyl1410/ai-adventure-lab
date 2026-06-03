import { useEffect, useState } from "react";
import { saveProgress, unlockSticker } from "@/lib/api";
import { PROGRESS_GAME_KEY, STICKER_ID, STICKER_MIN_SCORE } from "./constants";
import { buildFeedbackText, shuffleDeck } from "./questUtils";
import { ALL_SCENARIOS } from "./scenarios";
import type { Choice, Scenario } from "./types";

interface SessionLike {
  id: string;
}

export function useAiSafetyQuest(session: SessionLike | null) {
  const [deck, setDeck] = useState<Scenario[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDeck(shuffleDeck(ALL_SCENARIOS));
  }, []);

  const current = deck[index];

  function submitChoice(choice: Choice) {
    if (!current || feedback) {
      return;
    }
    const correct = choice === current.answer;
    const nextScore = score + (correct ? 1 : 0);
    setScore(nextScore);
    setFeedback(buildFeedbackText(correct, current.explain));

    if (index === deck.length - 1) {
      setDone(true);
      if (nextScore >= STICKER_MIN_SCORE) {
        unlockSticker(STICKER_ID);
      }
      if (session) {
        saveProgress(session.id, PROGRESS_GAME_KEY, nextScore, deck.length);
      }
    }
  }

  function goNext() {
    setFeedback("");
    setIndex((value) => Math.min(value + 1, deck.length - 1));
  }

  function restart() {
    setDeck(shuffleDeck(ALL_SCENARIOS));
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
    submitChoice,
    goNext,
    restart,
  };
}
