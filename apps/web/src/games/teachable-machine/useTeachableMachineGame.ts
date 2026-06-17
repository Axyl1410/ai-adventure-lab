import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { saveProgress, unlockSticker } from "@/lib/api";
import { DEFAULT_CLASSES } from "./classData";
import {
  GAME_KEY,
  INITIAL_PREDICTIONS,
  MIN_CLASSES_TO_TRAIN,
  PREDICTION_INTERVAL_MS,
  STICKER_ID,
  TRAINING_STEP_MS,
  TRAINING_STEPS,
} from "./constants";
import { extractFeaturesFromVideo } from "./featureExtraction";
import { predictClassWeighted } from "./knnClassifier";
import { countDistinctClassIds, getTopPrediction } from "./predictionUtils";
import { captureThumbnail } from "./thumbnailCapture";
import type {
  BuddyBotGameState,
  ClassConfig,
  Example,
  Predictions,
} from "./types";

interface SessionLike {
  id: string;
}

function buildDefaultClasses(
  t: ReturnType<typeof useTranslation>["t"]
): ClassConfig[] {
  return DEFAULT_CLASSES.map((cls) => ({
    ...cls,
    name: t(`teachableMachine.classes.${cls.classKey}`),
  }));
}

export function useTeachableMachineGame(session: SessionLike | null) {
  const { t } = useTranslation("gameContent");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const predictIntervalRef = useRef<number | null>(null);
  const trainIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [classes, setClasses] = useState<ClassConfig[]>(() =>
    buildDefaultClasses(t)
  );
  const [examples, setExamples] = useState<Example[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [isTrained, setIsTrained] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [status, setStatus] = useState(() =>
    t("teachableMachine.ui.welcomeStatus")
  );
  const [predictions, setPredictions] =
    useState<Predictions>(INITIAL_PREDICTIONS);

  const isTrainedRef = useRef(isTrained);
  isTrainedRef.current = isTrained;

  const examplesRef = useRef(examples);
  examplesRef.current = examples;

  const stopPredictionLoop = useCallback(() => {
    if (predictIntervalRef.current) {
      window.clearInterval(predictIntervalRef.current);
      predictIntervalRef.current = null;
    }
  }, []);

  const stopTrainInterval = useCallback(() => {
    if (trainIntervalRef.current) {
      clearInterval(trainIntervalRef.current);
      trainIntervalRef.current = null;
    }
  }, []);

  const invalidateTraining = useCallback(() => {
    setIsTrained(false);
    stopPredictionLoop();
  }, [stopPredictionLoop]);

  const startPredictionLoop = useCallback(() => {
    stopPredictionLoop();

    predictIntervalRef.current = window.setInterval(() => {
      const video = videoRef.current;
      const currentExamples = examplesRef.current;
      if (!video || video.readyState < 2 || currentExamples.length === 0) {
        return;
      }

      try {
        const currentFeatures = extractFeaturesFromVideo(video);
        const probs = predictClassWeighted(currentFeatures, currentExamples);
        setPredictions(probs);
      } catch (err) {
        console.error("Prediction error:", err);
      }
    }, PREDICTION_INTERVAL_MS);
  }, [stopPredictionLoop]);

  useEffect(
    () => () => {
      stopPredictionLoop();
      stopTrainInterval();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    },
    [stopPredictionLoop, stopTrainInterval]
  );

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus(t("teachableMachine.ui.noCameraSupport"));
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240 },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      setStatus(t("teachableMachine.ui.cameraReady"));
      if (isTrainedRef.current) {
        startPredictionLoop();
      }
    } catch (err) {
      console.error(err);
      setStatus(t("teachableMachine.ui.cameraPermissionDenied"));
    }
  }, [startPredictionLoop, t]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    stopPredictionLoop();
    setCameraActive(false);
    setStatus(t("teachableMachine.ui.cameraStopped"));
  }, [stopPredictionLoop, t]);

  const captureExample = useCallback(
    (classId: number) => {
      const video = videoRef.current;
      if (!video || video.readyState < 2) {
        setStatus(t("teachableMachine.ui.cameraNotReady"));
        return;
      }

      try {
        const thumbnail = captureThumbnail(video);
        const features = extractFeaturesFromVideo(video);

        const newExample: Example = {
          id: `${classId}-${Date.now()}-${Math.random()}`,
          classId,
          features,
          thumbnail,
        };

        setExamples((prev) => [...prev, newExample]);
        const className =
          classes.find((c) => c.id === classId)?.name ??
          t("teachableMachine.ui.unrecognized");
        setStatus(t("teachableMachine.ui.photoSaved", { name: className }));

        if (isTrainedRef.current) {
          invalidateTraining();
        }
      } catch (err) {
        console.error(err);
        setStatus(t("teachableMachine.ui.captureError"));
      }
    },
    [classes, invalidateTraining, t]
  );

  const deleteExample = useCallback(
    (id: string) => {
      setExamples((prev) => prev.filter((ex) => ex.id !== id));
      setStatus(t("teachableMachine.ui.photoDeleted"));
      if (isTrainedRef.current) {
        invalidateTraining();
      }
    },
    [invalidateTraining, t]
  );

  const clearClassExamples = useCallback(
    (classId: number) => {
      setExamples((prev) => prev.filter((ex) => ex.classId !== classId));
      setStatus(t("teachableMachine.ui.groupCleared"));
      if (isTrainedRef.current) {
        invalidateTraining();
      }
    },
    [invalidateTraining, t]
  );

  const handleClassNameChange = useCallback((id: number, newName: string) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: newName } : c))
    );
  }, []);

  const trainModel = useCallback(() => {
    const classCount = countDistinctClassIds(examplesRef.current);
    if (classCount < MIN_CLASSES_TO_TRAIN) {
      setStatus(t("teachableMachine.ui.needTwoGroups"));
      return;
    }

    setIsTraining(true);
    setStatus(t("teachableMachine.ui.preparing"));

    let step = 0;
    stopTrainInterval();
    trainIntervalRef.current = setInterval(() => {
      step++;
      if (step === 1) {
        setStatus(t("teachableMachine.ui.analyzingColors"));
      } else if (step === 2) {
        setStatus(t("teachableMachine.ui.buildingFeatures"));
      } else if (step === TRAINING_STEPS) {
        stopTrainInterval();
        setIsTraining(false);
        setIsTrained(true);
        setShowConfetti(true);
        setStatus(t("teachableMachine.ui.trainingComplete"));

        unlockSticker(STICKER_ID);
        if (session) {
          void saveProgress(session.id, GAME_KEY, 1, 1);
        }

        startPredictionLoop();
      }
    }, TRAINING_STEP_MS);
  }, [session, startPredictionLoop, stopTrainInterval, t]);

  const resetAll = useCallback(() => {
    setExamples([]);
    setIsTrained(false);
    setIsTraining(false);
    setShowConfetti(false);
    setPredictions(INITIAL_PREDICTIONS);
    setStatus(t("teachableMachine.ui.allCleared"));
    stopPredictionLoop();
    stopTrainInterval();
  }, [stopPredictionLoop, stopTrainInterval, t]);

  const distinctClassCount = countDistinctClassIds(examples);
  const canTrain = distinctClassCount >= MIN_CLASSES_TO_TRAIN;

  const topPrediction = useMemo(() => {
    const result = getTopPrediction(predictions, classes);
    if (result.id === 0) {
      return { ...result, name: t("teachableMachine.ui.unrecognized") };
    }
    return result;
  }, [predictions, classes, t]);

  const activeBotState: BuddyBotGameState = isTraining
    ? "thinking"
    : isTrained
      ? "reading"
      : "happy";

  return {
    videoRef,
    classes,
    examples,
    isTraining,
    isTrained,
    showConfetti,
    cameraActive,
    status,
    predictions,
    distinctClassCount,
    canTrain,
    topPrediction,
    activeBotState,
    startCamera,
    stopCamera,
    captureExample,
    deleteExample,
    clearClassExamples,
    handleClassNameChange,
    trainModel,
    resetAll,
  };
}
