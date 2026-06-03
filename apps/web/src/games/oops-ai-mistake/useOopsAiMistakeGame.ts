import { useEffect, useState } from "react";
import { saveProgress, unlockSticker } from "@/lib/api";
import { progressGameKey, STICKER_ID, STICKER_MIN_SCORE } from "./constants";
import { getQuestionBank } from "./gameData";
import { buildFeedbackText, shuffleRound } from "./oopsUtils";
import type { Level, OopsQuestion, Verdict } from "./types";

interface SessionLike {
  id: string;
}

export function useOopsAiMistakeGame(session: SessionLike | null) {
  const [level, setLevel] = useState<Level | null>(null);
  const [questions, setQuestions] = useState<OopsQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (level) {
      setQuestions(shuffleRound(getQuestionBank(level)));
      setIndex(0);
      setScore(0);
      setFeedback("");
      setShowConfetti(false);
    }
  }, [level]);

  const current = questions[index];
  const isLastQuestion = questions.length > 0 && index === questions.length - 1;

  function selectLevel(nextLevel: Level) {
    setLevel(nextLevel);
  }

  function clearLevel() {
    setLevel(null);
    setQuestions([]);
    setIndex(0);
    setScore(0);
    setFeedback("");
    setShowConfetti(false);
  }

  function submitChoice(choice: Verdict) {
    if (!current || feedback) {
      return;
    }
    const correct = choice === current.answer;
    const nextScore = score + (correct ? 1 : 0);
    setScore(nextScore);
    setFeedback(buildFeedbackText(correct, current.explain));

    if (isLastQuestion) {
      setShowConfetti(true);
      if (nextScore >= STICKER_MIN_SCORE) {
        unlockSticker(STICKER_ID);
      }
      if (session && level) {
        void saveProgress(
          session.id,
          progressGameKey(level),
          nextScore,
          questions.length
        );
      }
    }
  }

  function goNext() {
    setFeedback("");
    setIndex((v) => Math.min(v + 1, questions.length - 1));
  }

  return {
    level,
    questions,
    index,
    score,
    feedback,
    showConfetti,
    current,
    isLastQuestion,
    selectLevel,
    clearLevel,
    submitChoice,
    goNext,
  };
}
