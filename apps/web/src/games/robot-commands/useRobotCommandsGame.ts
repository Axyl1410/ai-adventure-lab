import { useCallback, useEffect, useState } from "react";
import { saveProgress, unlockSticker } from "../../lib/api";
import {
  INCOMPLETE_FEEDBACK,
  NO_PICK_FEEDBACK,
  PROGRESS_GAME_KEY,
  PUZZLES_PER_LEVEL,
  STEP_ANIMATION_MS,
  STICKER_ID,
  STICKER_MIN_SCORE,
  SUCCESS_FEEDBACK,
  wallFeedback,
} from "./constants";
import { getPuzzlesForLevel } from "./levels";
import { runProgram } from "./simulator";
import type {
  Cell,
  Command,
  Direction,
  Level,
  Puzzle,
  RunResult,
} from "./types";

interface SessionLike {
  id: string;
}

function initialSequence(puzzle: Puzzle): Command[] {
  return [...(puzzle.starterCommands ?? [])];
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function useRobotCommandsGame(session: SessionLike | null) {
  const [level, setLevel] = useState<Level | null>(null);
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [sequence, setSequence] = useState<Command[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSuccessFeedback, setIsSuccessFeedback] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [running, setRunning] = useState(false);
  const [robotPosition, setRobotPosition] = useState<Cell>({ x: 0, y: 0 });
  const [direction, setDirection] = useState<Direction>("north");
  const [highlightCell, setHighlightCell] = useState<Cell | null>(null);
  const [failIndex, setFailIndex] = useState<number | null>(null);

  const current = puzzles[puzzleIndex];
  const isLastPuzzle = puzzles.length > 0 && puzzleIndex === puzzles.length - 1;

  const resetRobotToStart = useCallback((puzzle: Puzzle) => {
    setRobotPosition({ ...puzzle.start });
    setDirection(puzzle.startDirection);
    setHighlightCell(null);
    setFailIndex(null);
  }, []);

  useEffect(() => {
    if (level) {
      const nextPuzzles = getPuzzlesForLevel(level);
      setPuzzles(nextPuzzles);
      setPuzzleIndex(0);
      setScore(0);
      setFeedback("");
      setIsSuccessFeedback(false);
      setShowConfetti(false);
      const first = nextPuzzles[0];
      if (first) {
        setSequence(initialSequence(first));
        resetRobotToStart(first);
      }
    }
  }, [level, resetRobotToStart]);

  useEffect(() => {
    if (current) {
      setSequence(initialSequence(current));
      resetRobotToStart(current);
      setFeedback("");
      setIsSuccessFeedback(false);
      setFailIndex(null);
    }
  }, [current, resetRobotToStart]);

  function selectLevel(nextLevel: Level) {
    setLevel(nextLevel);
  }

  function clearLevel() {
    setLevel(null);
    setPuzzles([]);
    setPuzzleIndex(0);
    setSequence([]);
    setScore(0);
    setFeedback("");
    setRunning(false);
  }

  function addCommand(command: Command) {
    if (running || feedback || !current) {
      return;
    }
    if (sequence.length >= current.maxCommands) {
      return;
    }
    if (!current.allowedCommands.includes(command)) {
      return;
    }
    setSequence((prev) => [...prev, command]);
    setFailIndex(null);
  }

  function removeAt(index: number) {
    if (running || feedback) {
      return;
    }
    setSequence((prev) => prev.filter((_, i) => i !== index));
    setFailIndex(null);
    if (current) {
      resetRobotToStart(current);
    }
  }

  function moveCommand(index: number, moveDirection: "left" | "right") {
    if (running || feedback) {
      return;
    }
    const target = moveDirection === "left" ? index - 1 : index + 1;
    if (target < 0 || target >= sequence.length) {
      return;
    }
    setSequence((prev) => {
      const next = [...prev];
      const temp = next[index];
      const swap = next[target];
      if (temp === undefined || swap === undefined) {
        return prev;
      }
      next[index] = swap;
      next[target] = temp;
      return next;
    });
    setFailIndex(null);
    if (current) {
      resetRobotToStart(current);
    }
  }

  function clearSequence() {
    if (running || feedback || !current) {
      return;
    }
    setSequence(initialSequence(current));
    resetRobotToStart(current);
    setFailIndex(null);
  }

  function showHint() {
    if (running || feedback || !current) {
      return;
    }
    setFeedback(current.hintVi);
    setIsSuccessFeedback(false);
  }

  function handleRunOutcome(result: RunResult) {
    if (result.outcome === "success") {
      const nextScore = score + 1;
      setScore(nextScore);
      setFeedback(SUCCESS_FEEDBACK);
      setIsSuccessFeedback(true);

      if (isLastPuzzle) {
        setShowConfetti(true);
        if (nextScore >= STICKER_MIN_SCORE) {
          unlockSticker(STICKER_ID);
        }
        if (session && level) {
          saveProgress(
            session.id,
            PROGRESS_GAME_KEY,
            nextScore,
            puzzles.length,
            { level }
          ).catch(() => undefined);
        }
      }
      return;
    }

    if (result.outcome === "wall" && result.failIndex !== undefined) {
      setFailIndex(result.failIndex);
      setFeedback(wallFeedback(result.failIndex + 1));
      setIsSuccessFeedback(false);
      return;
    }

    if (result.outcome === "no_pick") {
      setFeedback(NO_PICK_FEEDBACK);
      setIsSuccessFeedback(false);
      return;
    }

    setFeedback(INCOMPLETE_FEEDBACK);
    setIsSuccessFeedback(false);
  }

  async function runSimulation() {
    if (running || feedback || !current || sequence.length === 0) {
      return;
    }

    setRunning(true);
    setFailIndex(null);
    resetRobotToStart(current);

    const result = runProgram(current, sequence);

    for (const step of result.steps) {
      setRobotPosition({ ...step.position });
      setDirection(step.direction);
      setHighlightCell({ ...step.position });
      await sleep(STEP_ANIMATION_MS);
    }

    setRunning(false);
    setHighlightCell(null);
    handleRunOutcome(result);
  }

  function goNextPuzzle() {
    setFeedback("");
    setIsSuccessFeedback(false);
    setFailIndex(null);
    setPuzzleIndex((value) => Math.min(value + 1, puzzles.length - 1));
  }

  function dismissFeedback() {
    setFeedback("");
    setIsSuccessFeedback(false);
  }

  return {
    level,
    puzzles,
    puzzleIndex,
    current,
    sequence,
    score,
    feedback,
    isSuccessFeedback,
    showConfetti,
    running,
    robotPosition,
    direction,
    highlightCell,
    failIndex,
    isLastPuzzle,
    selectLevel,
    clearLevel,
    addCommand,
    removeAt,
    moveCommand,
    clearSequence,
    showHint,
    runSimulation,
    goNextPuzzle,
    dismissFeedback,
    totalPuzzles: puzzles.length || PUZZLES_PER_LEVEL,
  };
}
