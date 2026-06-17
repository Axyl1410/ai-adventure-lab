import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { saveProgress, unlockSticker } from "@/lib/api";
import { localizeDetectiveQuestion } from "@/lib/gameContent";
import { progressGameKey, STICKER_ID, STICKER_MIN_SCORE } from "./constants";
import { buildFeedbackText, shuffleRound } from "./detectiveUtils";
import { getQuestionBank } from "./gameData";
import type { DetectiveQuestion, Level } from "./types";

interface SessionLike {
  id: string;
}

export function useAiDetectiveGame(session: SessionLike | null) {
  const { t, i18n } = useTranslation("gameContent");
  const [level, setLevel] = useState<Level | null>(null);
  const [questions, setQuestions] = useState<DetectiveQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [feedbackCorrect, setFeedbackCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (level) {
      const base = shuffleRound(getQuestionBank(level));
      setQuestions(base.map((q) => localizeDetectiveQuestion(t, q)));
      setIndex(0);
      setScore(0);
      setFeedback("");
      setFeedbackCorrect(false);
      setShowConfetti(false);
    }
  }, [level, i18n.language, t]);

  const current = questions[index];
  const isLastQuestion = questions.length > 0 && index === questions.length - 1;

  function selectLevel(nextLevel: Level) {
    setLevel(nextLevel);
  }

  function clearLevel() {
    setLevel(null);
  }

  function submitAnswer(value: boolean) {
    if (!current || feedback) {
      return;
    }
    const correct = value === current.answer;
    const nextScore = score + (correct ? 1 : 0);
    setScore(nextScore);
    setFeedbackCorrect(correct);
    setFeedback(buildFeedbackText(t, correct, current.explain));

    if (isLastQuestion) {
      setShowConfetti(true);
      if (nextScore >= STICKER_MIN_SCORE) {
        unlockSticker(STICKER_ID);
      }
      if (session && level) {
        saveProgress(
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
    setFeedbackCorrect(false);
    setIndex((v) => Math.min(v + 1, questions.length - 1));
  }

  return {
    level,
    questions,
    index,
    score,
    feedback,
    feedbackCorrect,
    showConfetti,
    current,
    isLastQuestion,
    selectLevel,
    clearLevel,
    submitAnswer,
    goNext,
  };
}
