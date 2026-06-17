import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { saveProgress, unlockSticker } from "@/lib/api";
import { localizeScenario } from "@/lib/gameContent";
import { PROGRESS_GAME_KEY, STICKER_ID, STICKER_MIN_SCORE } from "./constants";
import { buildFeedbackText, shuffleDeck } from "./questUtils";
import { ALL_SCENARIOS } from "./scenarios";
import type { ChoiceId, Scenario } from "./types";

interface SessionLike {
  id: string;
}

export function useAiSafetyQuest(session: SessionLike | null) {
  const { t, i18n } = useTranslation("gameContent");
  const [deck, setDeck] = useState<Scenario[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [feedbackCorrect, setFeedbackCorrect] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const base = shuffleDeck(ALL_SCENARIOS);
    setDeck(base.map((s) => localizeScenario(t, s)));
  }, [i18n.language, t]);

  const current = deck[index];

  function submitChoice(choice: ChoiceId) {
    if (!current || feedback) {
      return;
    }
    const correct = choice === current.answer;
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
        saveProgress(session.id, PROGRESS_GAME_KEY, nextScore, deck.length);
      }
    }
  }

  function goNext() {
    setFeedback("");
    setFeedbackCorrect(false);
    setIndex((value) => Math.min(value + 1, deck.length - 1));
  }

  function restart() {
    const base = shuffleDeck(ALL_SCENARIOS);
    setDeck(base.map((s) => localizeScenario(t, s)));
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
    submitChoice,
    goNext,
    restart,
  };
}
