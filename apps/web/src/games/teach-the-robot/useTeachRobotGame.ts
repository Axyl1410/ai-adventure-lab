import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { saveProgress, unlockSticker } from "@/lib/api";
import { localizeTeachItem } from "@/lib/gameContent";
import {
  AUTO_ADVANCE_MS,
  STICKER_MIN_CORRECT,
  TRAIN_DELAY_MS,
} from "./constants";
import { getItemsForLevel } from "./gameData";
import { countCorrect, getLabelProgress, isWeakModel } from "./scoring";
import type { Answers, GroupId, Item, Level } from "./types";

interface SessionLike {
  id: string;
}

function createInitialAnswers(): Answers {
  return {};
}

export function useTeachRobotGame(session: SessionLike | null) {
  const { t, i18n } = useTranslation("gameContent");
  const [level, setLevel] = useState<Level | null>(null);
  const [answers, setAnswers] = useState<Answers>(createInitialAnswers);
  const [trained, setTrained] = useState(false);
  const [training, setTraining] = useState(false);
  const [index, setIndex] = useState(0);

  const mountedRef = useRef(true);
  const contentScrollRef = useRef<HTMLDivElement>(null);
  const trainTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const items = useMemo(() => {
    if (!level) {
      return [];
    }
    return getItemsForLevel(level).map((item) => localizeTeachItem(t, item));
  }, [level, i18n.language, t]);

  const current: Item | undefined = items[index];
  const labeledCount = Object.keys(answers).length;
  const correct = countCorrect(items, answers);
  const weak = isWeakModel(correct);
  const labelProgress = getLabelProgress(labeledCount, items.length);

  const resetPlayState = useCallback(() => {
    setAnswers(createInitialAnswers());
    setTrained(false);
    setTraining(false);
    setIndex(0);
    if (trainTimeoutRef.current) {
      clearTimeout(trainTimeoutRef.current);
      trainTimeoutRef.current = null;
    }
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (trainTimeoutRef.current) {
        clearTimeout(trainTimeoutRef.current);
      }
      if (advanceTimeoutRef.current) {
        clearTimeout(advanceTimeoutRef.current);
      }
    };
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll when object index changes
  useEffect(() => {
    contentScrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [index]);

  const selectLevel = useCallback(
    (nextLevel: Level) => {
      resetPlayState();
      setLevel(nextLevel);
    },
    [resetPlayState]
  );

  const resetLevel = useCallback(() => {
    resetPlayState();
    setLevel(null);
  }, [resetPlayState]);

  const goToIndex = useCallback(
    (nextIndex: number) => {
      setIndex(Math.max(0, Math.min(nextIndex, items.length - 1)));
    },
    [items.length]
  );

  const goPrev = useCallback(() => {
    setIndex((v) => Math.max(v - 1, 0));
  }, []);

  const goNext = useCallback(() => {
    setIndex((v) => Math.min(v + 1, items.length - 1));
  }, [items.length]);

  const assignLabel = useCallback(
    (itemId: string, group: GroupId, currentIndex: number) => {
      setAnswers((prev) => ({ ...prev, [itemId]: group }));

      if (currentIndex < items.length - 1) {
        if (advanceTimeoutRef.current) {
          clearTimeout(advanceTimeoutRef.current);
        }
        advanceTimeoutRef.current = setTimeout(() => {
          setIndex((v) => Math.min(v + 1, items.length - 1));
          advanceTimeoutRef.current = null;
        }, AUTO_ADVANCE_MS);
      }
    },
    [items.length]
  );

  const train = useCallback(() => {
    if (!level) {
      return;
    }

    setTraining(true);
    const snapshotCorrect = countCorrect(items, answers);
    const snapshotAnswers = { ...answers };

    trainTimeoutRef.current = setTimeout(() => {
      if (!mountedRef.current) {
        return;
      }
      setTraining(false);
      setTrained(true);

      if (snapshotCorrect >= STICKER_MIN_CORRECT) {
        unlockSticker("robot");
      }
      if (session) {
        void saveProgress(
          session.id,
          `teach-robot-${level}`,
          snapshotCorrect,
          items.length,
          { answers: snapshotAnswers }
        );
      }
      trainTimeoutRef.current = null;
    }, TRAIN_DELAY_MS);
  }, [answers, items, level, session]);

  return {
    level,
    answers,
    trained,
    training,
    index,
    items,
    current,
    labeledCount,
    correct,
    weak,
    labelProgress,
    contentScrollRef,
    selectLevel,
    resetLevel,
    assignLabel,
    train,
    goToIndex,
    goPrev,
    goNext,
  };
}
