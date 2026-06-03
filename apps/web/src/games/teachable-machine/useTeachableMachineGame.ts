import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { saveProgress, unlockSticker } from "@/lib/api";
import { DEFAULT_CLASSES } from "./classData";
import {
  GAME_KEY,
  INITIAL_PREDICTIONS,
  MIN_CLASSES_TO_TRAIN,
  PREDICTION_INTERVAL_MS,
  STATUS_WELCOME,
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

export function useTeachableMachineGame(session: SessionLike | null) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const predictIntervalRef = useRef<number | null>(null);
  const trainIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [classes, setClasses] = useState<ClassConfig[]>(DEFAULT_CLASSES);
  const [examples, setExamples] = useState<Example[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [isTrained, setIsTrained] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [status, setStatus] = useState(STATUS_WELCOME);
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
      setStatus(
        "📷 Trình duyệt này chưa hỗ trợ camera. Em vẫn có thể đọc cẩm nang để hiểu AI học từ ví dụ nhé!"
      );
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
      setStatus(
        "📸 Camera đã sẵn sàng! Bây giờ em hãy tự sửa tên 3 nhóm bên dưới và chụp ảnh ví dụ nhé!"
      );
      if (isTrainedRef.current) {
        startPredictionLoop();
      }
    } catch (err) {
      console.error(err);
      setStatus(
        "😥 Không mở được camera. Vui lòng cấp quyền truy cập camera cho trình duyệt nhé!"
      );
    }
  }, [startPredictionLoop]);

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
    setStatus("📷 Camera đã tạm tắt.");
  }, [stopPredictionLoop]);

  const captureExample = useCallback(
    (classId: number) => {
      const video = videoRef.current;
      if (!video || video.readyState < 2) {
        setStatus("⚠️ Camera chưa sẵn sàng, hãy đợi một chút nhé!");
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
        setStatus(
          `📸 Đã lưu 1 ảnh ví dụ cho nhóm "${classes.find((c) => c.id === classId)?.name}"!`
        );

        if (isTrainedRef.current) {
          invalidateTraining();
        }
      } catch (err) {
        console.error(err);
        setStatus("😥 Lỗi khi chụp ảnh từ camera.");
      }
    },
    [classes, invalidateTraining]
  );

  const deleteExample = useCallback(
    (id: string) => {
      setExamples((prev) => prev.filter((ex) => ex.id !== id));
      setStatus("🗑️ Đã xóa ảnh ví dụ.");
      if (isTrainedRef.current) {
        invalidateTraining();
      }
    },
    [invalidateTraining]
  );

  const clearClassExamples = useCallback(
    (classId: number) => {
      setExamples((prev) => prev.filter((ex) => ex.classId !== classId));
      setStatus("🗑️ Đã xóa toàn bộ ví dụ của nhóm.");
      if (isTrainedRef.current) {
        invalidateTraining();
      }
    },
    [invalidateTraining]
  );

  const handleClassNameChange = useCallback((id: number, newName: string) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: newName } : c))
    );
  }, []);

  const trainModel = useCallback(() => {
    const classCount = countDistinctClassIds(examplesRef.current);
    if (classCount < MIN_CLASSES_TO_TRAIN) {
      setStatus(
        "⚠️ Robot cần hình ảnh của ít nhất 2 nhóm khác nhau để so sánh học tập!"
      );
      return;
    }

    setIsTraining(true);
    setStatus("⏳ Đang chuẩn bị: Đọc hình ảnh...");

    let step = 0;
    stopTrainInterval();
    trainIntervalRef.current = setInterval(() => {
      step++;
      if (step === 1) {
        setStatus("🧠 Đang phân tích nhóm màu sắc của ảnh...");
      } else if (step === 2) {
        setStatus("⚙️ Đang lập bản đồ toán học đặc trưng...");
      } else if (step === TRAINING_STEPS) {
        stopTrainInterval();
        setIsTraining(false);
        setIsTrained(true);
        setShowConfetti(true);
        setStatus(
          "🎉 Học xong rồi! Robot đang dự đoán trực tiếp từ camera của em!"
        );

        unlockSticker(STICKER_ID);
        if (session) {
          void saveProgress(session.id, GAME_KEY, 1, 1);
        }

        startPredictionLoop();
      }
    }, TRAINING_STEP_MS);
  }, [session, startPredictionLoop, stopTrainInterval]);

  const resetAll = useCallback(() => {
    setExamples([]);
    setIsTrained(false);
    setIsTraining(false);
    setShowConfetti(false);
    setPredictions(INITIAL_PREDICTIONS);
    setStatus("🔄 Đã xóa tất cả ví dụ. Hãy bắt đầu chụp ảnh mới nhé!");
    stopPredictionLoop();
    stopTrainInterval();
  }, [stopPredictionLoop, stopTrainInterval]);

  const distinctClassCount = countDistinctClassIds(examples);
  const canTrain = distinctClassCount >= MIN_CLASSES_TO_TRAIN;

  const topPrediction = useMemo(
    () => getTopPrediction(predictions, classes),
    [predictions, classes]
  );

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
