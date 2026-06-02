import { motion } from "framer-motion";
import oopsBanner from "../../../assets/oops-banner.png";
import type { Level } from "../types";

interface LevelSelectScreenProps {
  onSelectLevel: (level: Level) => void;
}

export function LevelSelectScreen({ onSelectLevel }: LevelSelectScreenProps) {
  return (
    <div className="lab-card mx-auto max-w-2xl space-y-6 bg-white/80 p-8 text-center">
      <div className="mb-2 flex max-h-48 w-full items-center justify-center overflow-hidden rounded-2xl bg-redSoft/15 shadow-md">
        <img
          alt="AI Có Thể Sai Banner"
          className="h-full max-h-48 w-full object-cover"
          src={oopsBanner}
        />
      </div>
      <h2 className="font-black text-3xl text-ink">Thám tử Rà soát Lỗi AI</h2>
      <p className="font-bold text-lg text-muted">
        AI không phải lúc nào cũng thông minh và đúng đắn. Hãy tập kiểm tra
        thông tin nhé!
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <motion.button
          className="big-button bg-gradient-to-br from-greenLab to-mintLab py-4 text-ink text-lg"
          onClick={() => onSelectLevel("easy")}
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="mr-2 text-2xl">🌱</span> Logic Thực tế
          <span className="mt-1 block font-semibold text-ink/60 text-xs">
            Ngẫu nhiên 5 câu rà soát
          </span>
        </motion.button>
        <motion.button
          className="big-button bg-gradient-to-br from-purpleLab to-pinkLab py-4 text-lg text-white"
          onClick={() => onSelectLevel("hard")}
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="mr-2 text-2xl">🔥</span> Tin giả & Ảo tưởng AI
          <span className="mt-1 block font-semibold text-white/70 text-xs">
            Ngẫu nhiên 5 câu nâng cao
          </span>
        </motion.button>
      </div>
    </div>
  );
}
