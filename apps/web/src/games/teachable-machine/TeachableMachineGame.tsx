import * as tf from "@tensorflow/tfjs";
import { motion } from "framer-motion";
import { BookOpen, Camera, Cpu, Sparkles, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BuddyBot } from "../../components/BuddyBot";
import { ConfettiSuccess } from "../../components/Feedback";
import { GameShell } from "../../components/GameShell";
import { TTSButton } from "../../components/TTSButton";
import { useSession } from "../../hooks/useSession";
import { saveProgress, unlockSticker } from "../../lib/api";

interface Example {
  classId: number;
  features: number[];
  id: string;
  thumbnail: string;
}

interface ClassConfig {
  accentColor: string;
  borderColor: string;
  color: string;
  emoji: string;
  id: number;
  name: string;
}

const defaultClasses: ClassConfig[] = [
  {
    id: 1,
    name: "Mặt cười của em",
    emoji: "😊",
    color: "bg-greenLab/10",
    borderColor: "border-greenLab/40",
    accentColor: "bg-greenLab",
  },
  {
    id: 2,
    name: "Bàn tay xin chào",
    emoji: "🖐️",
    color: "bg-yellowLab/10",
    borderColor: "border-yellowLab/40",
    accentColor: "bg-yellowLab",
  },
  {
    id: 3,
    name: "Đồ vật học tập",
    emoji: "🧸",
    color: "bg-skyLab/10",
    borderColor: "border-skyLab/40",
    accentColor: "bg-skyLab",
  },
];

// Distance-Weighted KNN Classifier
const predictClassWeighted = (
  currentFeatures: number[],
  examples: Example[]
) => {
  const probabilities: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
  if (examples.length === 0) {
    return probabilities;
  }

  // 1. Calculate distances to all examples
  const distances = examples.map((ex) => {
    let sum = 0;
    for (let i = 0; i < currentFeatures.length; i++) {
      const diff = currentFeatures[i] - ex.features[i];
      sum += diff * diff;
    }
    const dist = Math.sqrt(sum);
    return { classId: ex.classId, dist };
  });

  // 2. Sort by distance (ascending)
  distances.sort((a, b) => a.dist - b.dist);

  // 3. Take top K nearest neighbors (e.g. K = 7)
  const K = Math.min(7, examples.length);
  const topK = distances.slice(0, K);

  // 4. Distance-weighted vote
  const weights: Record<number, number> = {};
  let totalWeight = 0;

  topK.forEach((item) => {
    const w = 1 / (item.dist + 0.001); // avoid division by zero
    weights[item.classId] = (weights[item.classId] || 0) + w;
    totalWeight += w;
  });

  // 5. Convert to percentages
  if (totalWeight > 0) {
    Object.keys(weights).forEach((classIdStr) => {
      const classId = Number(classIdStr);
      probabilities[classId] = weights[classId] / totalWeight;
    });
  }

  return probabilities;
};

interface GuideStepProps {
  color: string;
  desc: string;
  emoji: string;
  step: number;
  title: string;
}

function GuideStep({ step, emoji, title, desc, color }: GuideStepProps) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-white bg-white/60 p-2 shadow-xs">
      <span
        className={`grid h-5 w-5 shrink-0 place-items-center rounded-full font-black text-[10px] text-white ${color} shadow-xs`}
      >
        {step}
      </span>
      <div className="space-y-0.5 text-left">
        <h4 className="flex items-center gap-1 font-black text-ink text-xs">
          <span>{emoji}</span> {title}
        </h4>
        <p className="font-bold text-[10px] text-muted leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}

export function TeachableMachineGame() {
  const { session } = useSession();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const predictIntervalRef = useRef<number | null>(null);

  const [classes, setClasses] = useState<ClassConfig[]>(defaultClasses);
  const [examples, setExamples] = useState<Example[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [isTrained, setIsTrained] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [status, setStatus] = useState(
    "Chào mừng em! Hãy bấm nút 'Bật Camera' để bắt đầu tự đặt tên nhóm và chụp ảnh nhé!"
  );
  const [predictions, setPredictions] = useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
  });

  // Stop camera and prediction loops on unmount
  // FIX: use refs for cleanup to avoid stale closures; stopCamera is not needed in deps
  useEffect(() => {
    return () => {
      if (predictIntervalRef.current) {
        window.clearInterval(predictIntervalRef.current);
        predictIntervalRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startCamera() {
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
      if (isTrained) {
        startPredictionLoop();
      }
    } catch (err) {
      console.error(err);
      setStatus(
        "😥 Không mở được camera. Vui lòng cấp quyền truy cập camera cho trình duyệt nhé!"
      );
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (predictIntervalRef.current) {
      window.clearInterval(predictIntervalRef.current);
      predictIntervalRef.current = null;
    }
    setCameraActive(false);
    setStatus("📷 Camera đã tạm tắt.");
  }

  const captureExample = (classId: number) => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) {
      setStatus("⚠️ Camera chưa sẵn sàng, hãy đợi một chút nhé!");
      return;
    }

    try {
      // 1. Get Base64 thumbnail via hidden canvas
      const canvas = document.createElement("canvas");
      canvas.width = 80;
      canvas.height = 60;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, 80, 60);
      }
      const thumbnail = canvas.toDataURL("image/jpeg", 0.7);

      // 2. Extract features using TensorFlow.js (16x16 grid = 256 pixels)
      const features = tf.tidy(() => {
        const tensor = tf.browser.fromPixels(video);
        const resized = tf.image.resizeBilinear(tensor, [16, 16]);
        const normalized = resized.toFloat().div(255);
        return Array.from(normalized.dataSync());
      });

      // 3. Save example
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

      // If we are already in prediction mode, cancel it so they must train again
      if (isTrained) {
        setIsTrained(false);
        if (predictIntervalRef.current) {
          window.clearInterval(predictIntervalRef.current);
          predictIntervalRef.current = null;
        }
      }
    } catch (err) {
      console.error(err);
      setStatus("😥 Lỗi khi chụp ảnh từ camera.");
    }
  };

  const deleteExample = (id: string) => {
    setExamples((prev) => prev.filter((ex) => ex.id !== id));
    setStatus("🗑️ Đã xóa ảnh ví dụ.");
    if (isTrained) {
      setIsTrained(false);
      if (predictIntervalRef.current) {
        window.clearInterval(predictIntervalRef.current);
        predictIntervalRef.current = null;
      }
    }
  };

  const clearClassExamples = (classId: number) => {
    setExamples((prev) => prev.filter((ex) => ex.classId !== classId));
    setStatus("🗑️ Đã xóa toàn bộ ví dụ của nhóm.");
    if (isTrained) {
      setIsTrained(false);
      if (predictIntervalRef.current) {
        window.clearInterval(predictIntervalRef.current);
        predictIntervalRef.current = null;
      }
    }
  };

  const handleClassNameChange = (id: number, newName: string) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: newName } : c))
    );
  };

  const trainModel = () => {
    const classCount = new Set(examples.map((ex) => ex.classId)).size;
    if (classCount < 2) {
      setStatus(
        "⚠️ Robot cần hình ảnh của ít nhất 2 nhóm khác nhau để so sánh học tập!"
      );
      return;
    }

    setIsTraining(true);
    setStatus("⏳ Đang chuẩn bị: Đọc hình ảnh...");

    // Simulate incremental training steps for child educational engagement
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step === 1) {
        setStatus("🧠 Đang phân tích nhóm màu sắc của ảnh...");
      } else if (step === 2) {
        setStatus("⚙️ Đang lập bản đồ toán học đặc trưng...");
      } else if (step === 3) {
        clearInterval(interval);
        setIsTraining(false);
        setIsTrained(true);
        setShowConfetti(true);
        setStatus(
          "🎉 Học xong rồi! Robot đang dự đoán trực tiếp từ camera của em!"
        );

        // FIX: sticker id must match STICKERS on HomePage ("robot" for ML games)
        unlockSticker("robot");
        if (session) {
          void saveProgress(session.id, "teachable-machine", 1, 1);
        }

        startPredictionLoop();
      }
    }, 600);
  };

  const startPredictionLoop = () => {
    if (predictIntervalRef.current) {
      window.clearInterval(predictIntervalRef.current);
    }

    predictIntervalRef.current = window.setInterval(() => {
      const video = videoRef.current;
      if (!video || video.readyState < 2 || examples.length === 0) {
        return;
      }

      try {
        const currentFeatures = tf.tidy(() => {
          const tensor = tf.browser.fromPixels(video);
          const resized = tf.image.resizeBilinear(tensor, [16, 16]);
          const normalized = resized.toFloat().div(255);
          return Array.from(normalized.dataSync());
        });

        const probs = predictClassWeighted(currentFeatures, examples);
        setPredictions(probs);
      } catch (err) {
        console.error("Prediction error:", err);
      }
    }, 250);
  };

  const resetAll = () => {
    setExamples([]);
    setIsTrained(false);
    setIsTraining(false);
    setShowConfetti(false);
    setPredictions({ 1: 0, 2: 0, 3: 0 });
    setStatus("🔄 Đã xóa tất cả ví dụ. Hãy bắt đầu chụp ảnh mới nhé!");
    if (predictIntervalRef.current) {
      window.clearInterval(predictIntervalRef.current);
      predictIntervalRef.current = null;
    }
  };

  // Find predicted class with highest probability
  const maxClassId = Object.entries(predictions).reduce(
    (max, [classId, prob]) =>
      prob > max.prob ? { id: Number(classId), prob } : max,
    { id: 0, prob: 0 }
  ).id;

  const maxClassName =
    classes.find((c) => c.id === maxClassId)?.name || "Chưa nhận diện";
  const maxClassEmoji = classes.find((c) => c.id === maxClassId)?.emoji || "❓";

  const activeBotState = isTraining
    ? "thinking"
    : isTrained
      ? "reading"
      : "happy";

  return (
    <GameShell
      instruction="Camera chỉ chạy cục bộ để robot học bằng ví dụ. Ảnh không gửi lên máy chủ. 🔒"
      subtitle="Tự dạy AI nhận biết hình ảnh trực tiếp trong trình duyệt."
      title="📷 Huấn Luyện AI Mini"
    >
      {showConfetti && <ConfettiSuccess />}
      <section className="grid flex-1 gap-4 lg:grid-cols-[1fr_340px]">
        {/* Left Column: Webcam & Training Classes */}
        <div className="lab-card flex flex-col justify-between rounded-3xl border border-white/60 bg-white/85 p-4 shadow-sm sm:p-5">
          {/* Top Section: Webcam Stream & Controls */}
          <div className="flex flex-shrink-0 flex-col items-center gap-4 rounded-2xl border border-yellowLab/10 bg-cream/40 p-3 sm:flex-row">
            <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-ink shadow-inner sm:aspect-square sm:w-44">
              {!cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center text-white/50 text-xs">
                  <Camera className="mb-1.5 h-8 w-8 animate-pulse" />
                  <span>Camera chưa bật</span>
                </div>
              )}
              <video
                autoPlay={true}
                className={`h-full w-full object-cover ${cameraActive ? "opacity-100" : "opacity-0"}`}
                muted={true}
                playsInline={true}
                ref={videoRef}
              />
            </div>

            <div className="w-full flex-1 space-y-2 text-center sm:text-left">
              <h3 className="flex items-center justify-center gap-1.5 font-black text-ink text-sm sm:justify-start">
                📹 Trình thu thập dữ liệu
              </h3>
              <p className="font-bold text-[11px] text-muted leading-relaxed">
                Để robot học tốt, em hãy dùng đồ vật học tập thay vì chụp mặt
                thật. Ảnh chỉ ở trong trình duyệt và không gửi lên máy chủ.
              </p>
              <div className="flex justify-center gap-2 pt-1 sm:justify-start">
                {cameraActive ? (
                  <button
                    className="big-button min-h-12 bg-gradient-to-r from-redSoft to-pinkLab px-4 py-2 text-ink text-xs shadow-sm"
                    onClick={stopCamera}
                    type="button"
                  >
                    🛑 Tắt Camera
                  </button>
                ) : (
                  <button
                    className="big-button min-h-12 bg-gradient-to-r from-greenLab to-mintLab px-4 py-2 text-ink text-xs shadow-sm"
                    onClick={startCamera}
                    type="button"
                  >
                    🚀 Bật Camera
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Middle Section: Group / Class Capture Grid */}
          <div className="my-3.5 grid grid-cols-1 gap-3 md:grid-cols-3">
            {classes.map((cls) => {
              const classExamples = examples.filter(
                (ex) => ex.classId === cls.id
              );
              return (
                <div
                  className={`flex min-h-0 flex-col justify-between rounded-2xl border p-3 ${cls.color} ${cls.borderColor}`}
                  key={cls.id}
                >
                  <div className="space-y-2">
                    {/* Class Name Input */}
                    <div className="flex items-center gap-1.5 rounded-xl border border-white bg-white/70 px-2 py-1">
                      <span className="select-none text-xl">{cls.emoji}</span>
                      <input
                        aria-label={`Tên nhóm ${cls.id}`}
                        className="w-full bg-transparent font-black text-ink text-xs placeholder-ink/40 focus:outline-none"
                        onChange={(e) =>
                          handleClassNameChange(cls.id, e.target.value)
                        }
                        placeholder={`Nhóm ${cls.id}`}
                        value={cls.name}
                      />
                    </div>

                    {/* Image Capture Action */}
                    <button
                      className="big-button flex min-h-12 w-full items-center justify-center gap-1.5 border border-white bg-white px-3 py-2 font-black text-ink text-xs shadow-xs hover:bg-white/90 disabled:opacity-40"
                      disabled={!cameraActive}
                      onClick={() => captureExample(cls.id)}
                      type="button"
                    >
                      <Camera className="h-3.5 w-3.5" /> Chụp 1 ảnh
                    </button>

                    <div className="flex items-center justify-between px-1 font-black text-[10px] text-muted">
                      <span>📸 Đã chụp: {classExamples.length} ảnh</span>
                      {classExamples.length > 0 && (
                        <button
                          aria-label={`Xóa toàn bộ ảnh ví dụ của nhóm ${cls.name}`}
                          className="flex items-center gap-0.5 font-bold text-red-500 hover:text-red-700"
                          onClick={() => clearClassExamples(cls.id)}
                          title="Xóa ví dụ nhóm này"
                          type="button"
                        >
                          <Trash2 className="h-3 w-3" /> Xóa ảnh
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail Row */}
                  <div className="mt-2.5 flex h-14 min-w-0 items-center gap-1.5 overflow-x-auto rounded-xl border border-white/50 bg-white/40 px-1.5 shadow-inner">
                    {classExamples.length === 0 ? (
                      <div className="mx-auto text-center font-bold text-[10px] text-muted/60 italic">
                        Chưa có ảnh
                      </div>
                    ) : (
                      classExamples.map((ex) => (
                        <div
                          className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg border border-white/80 shadow-xs"
                          key={ex.id}
                        >
                          <img
                            alt="Thumbnail"
                            className="h-full w-full object-cover"
                            src={ex.thumbnail}
                          />
                          <button
                            aria-label={`Xóa ảnh ví dụ khỏi nhóm ${cls.name}`}
                            className="absolute top-0 right-0 rounded-bl-lg bg-red-500 p-0.5 text-white shadow-xs transition-colors hover:bg-red-700"
                            onClick={() => deleteExample(ex.id)}
                            type="button"
                          >
                            <X className="h-2 w-2" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Section: Training Trigger */}
          <div className="flex flex-col gap-3 border-white/40 border-t pt-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="rounded-xl border border-white/80 bg-white/60 px-3 py-1.5 font-bold text-[11px] text-muted shadow-xs">
              📊 Tổng số ảnh đã thu thập:{" "}
              <span className="font-black text-purpleLab">
                {examples.length} ảnh
              </span>
            </span>

            <button
              className="big-button flex min-h-12 items-center justify-center gap-1.5 bg-gradient-to-r from-ink to-ink/90 px-5 py-2 text-white text-xs shadow-md disabled:scale-100 disabled:opacity-40"
              disabled={
                isTraining || new Set(examples.map((ex) => ex.classId)).size < 2
              }
              onClick={trainModel}
              type="button"
            >
              <Cpu className="h-4 w-4" />
              {isTraining ? "⏳ Đang học..." : "🧠 Huấn luyện AI của em"}
            </button>
          </div>
        </div>

        {/* Right Column: AI Training Dashboard & Predictions / Guide */}
        <aside className="lab-card flex flex-col justify-between rounded-3xl border-white/70 bg-white/85 p-4 shadow-sm sm:p-5">
          <div className="flex-shrink-0 space-y-3.5">
            {/* Mascot Header */}
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <BuddyBot size={48} state={activeBotState} />
              </div>
              <div>
                <h2 className="font-black text-ink text-lg tracking-tight">
                  Máy học Trình duyệt
                </h2>
                <p className="font-bold text-[10px] text-muted uppercase tracking-wider">
                  Trực quan hóa thuật toán KNN
                </p>
              </div>
            </div>

            {/* Status Console Box */}
            <div className="relative rounded-2xl border border-yellowLab/20 bg-cream/70 p-3 shadow-xs">
              <p className="font-bold text-ink text-xs leading-relaxed">
                {status}
              </p>
              <div className="absolute right-2 bottom-2">
                <TTSButton
                  autoPlay={true}
                  autoPlayRole="content"
                  compact={true}
                  text={status}
                />
              </div>
            </div>
          </div>

          {/* Predictions or Interactive Guide Book */}
          <div className="my-3 flex flex-col justify-center pr-1 lg:max-h-[430px] lg:overflow-y-auto">
            {isTrained ? (
              <div className="space-y-3.5">
                <h3 className="flex items-center gap-1 font-black text-muted text-xs uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5 animate-spin text-yellow-500" />{" "}
                  Robot đang đoán thử:
                </h3>

                {classes.map((cls) => {
                  const prob = predictions[cls.id] || 0;
                  const probPercent = Math.round(prob * 100);
                  return (
                    <div key={cls.id}>
                      <div className="mb-1 flex justify-between font-bold text-xs">
                        <span className="flex items-center gap-1 text-ink">
                          <span className="select-none text-lg">
                            {cls.emoji}
                          </span>
                          <span className="max-w-36 truncate font-black">
                            {cls.name}
                          </span>
                        </span>
                        <span className="font-black text-purpleLab">
                          {probPercent}%
                        </span>
                      </div>

                      <div className="relative h-4 overflow-hidden rounded-full border border-white/80 bg-white/60 shadow-inner">
                        <motion.div
                          animate={{ width: `${probPercent}%` }}
                          className={`h-full rounded-full ${cls.accentColor}`}
                          initial={{ width: "0%" }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="min-h-0 space-y-2.5 overflow-y-auto pr-1">
                <div className="flex flex-shrink-0 items-center justify-between border-gray-100 border-b pb-1.5">
                  <h3 className="flex items-center gap-1 font-black text-muted text-xs uppercase tracking-wider">
                    <BookOpen className="h-3.5 w-3.5 text-skyLab" /> Cẩm nang 4
                    bước siêu dễ
                  </h3>
                  <TTSButton
                    compact={true}
                    text="Cẩm nang huấn luyện AI với 4 bước siêu dễ. Bước 1: Đặt tên cho 3 nhóm. Em bấm vào ô chữ ở mỗi nhóm để đặt tên nhé. Bước 2: Bật camera và chụp ảnh. Hãy chụp mỗi nhóm từ 3 đến 5 bức ảnh ở nhiều góc khác nhau. Bước 3: Huấn luyện AI. Bấm nút huấn luyện để robot học các ví dụ của em. Bước 4: Trải nghiệm dự đoán trực tiếp."
                  />
                </div>

                <div className="space-y-2">
                  <GuideStep
                    color="bg-skyLab"
                    desc="Em bấm trực tiếp vào ô chữ của mỗi nhóm để tự đặt tên nhé! Ví dụ: 'Mặt cười 😊', 'Bút chì ✏️', 'Điện thoại 📱'."
                    emoji="🏷️"
                    step={1}
                    title="Đặt tên cho 3 nhóm"
                  />
                  <GuideStep
                    color="bg-purpleLab"
                    desc="Bấm 'Bật Camera'. Ưu tiên dùng bút, sách, đồ chơi hoặc thẻ màu; tránh chụp mặt thật của em nhé!"
                    emoji="📸"
                    step={2}
                    title="Bật camera & Chụp ảnh"
                  />
                  <GuideStep
                    color="bg-greenLab"
                    desc="Khi đã chụp ảnh cho ít nhất 2 nhóm khác nhau, hãy bấm nút đen 'Huấn luyện AI của em' ở dưới để robot bắt đầu học."
                    emoji="🧠"
                    step={3}
                    title="Huấn luyện AI của em"
                  />
                  <GuideStep
                    color="bg-pinkLab"
                    desc="Học xong, em chỉ cần di chuyển trước camera, thanh độ tin cậy tương ứng sẽ tự động tăng giảm để hiển thị kết quả đoán!"
                    emoji="🔮"
                    step={4}
                    title="Trải nghiệm robot dự đoán"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Area */}
          <div className="flex-shrink-0 space-y-2 border-white/40 border-t pt-3">
            {isTrained && (
              <div className="rounded-2xl border border-skyLab/20 bg-skyLab/15 p-2.5 font-bold text-[11px] text-ink leading-relaxed shadow-xs">
                🤖 AI phân loại:{" "}
                <span className="font-black text-purple-700">
                  {maxClassEmoji} {maxClassName}
                </span>
                <p className="mt-0.5 font-bold text-[10px] text-muted">
                  💡 Thử giơ các đồ vật khác hoặc thay đổi khuôn mặt xem AI có
                  bị đoán nhầm không nhé!
                </p>
              </div>
            )}

            <button
              className="big-button flex w-full items-center justify-center gap-1.5 border border-yellowLab/40 bg-cream py-2 font-black text-ink text-xs shadow-xs"
              onClick={resetAll}
              type="button"
            >
              🔄 Xóa hết ví dụ & Làm lại
            </button>
          </div>
        </aside>
      </section>
    </GameShell>
  );
}
