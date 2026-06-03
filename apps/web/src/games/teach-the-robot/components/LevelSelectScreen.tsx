import { motion } from "motion/react";
import robotLab from "@/assets/robot-lab.png";
import type { Level } from "../types";

interface LevelSelectScreenProps {
  onSelectLevel: (level: Level) => void;
}

export function LevelSelectScreen({ onSelectLevel }: LevelSelectScreenProps) {
  return (
    <div className="lab-card mx-auto max-w-2xl space-y-5 bg-white/80 p-6 text-center shadow-md md:p-8">
      <div className="mb-2 flex max-h-36 w-full items-center justify-center overflow-hidden rounded-2xl bg-greenLab/15 shadow-md sm:max-h-40">
        <img
          alt="Dạy Robot Học Banner"
          className="h-full max-h-48 w-full object-cover"
          src={robotLab}
        />
      </div>
      <h2 className="font-black text-3xl text-ink">Dạy Robot Học Máy</h2>
      <p className="font-bold text-lg text-muted">
        Robot cần em gán nhãn đúng để học tốt hơn. Em muốn dạy ở cấp độ nào?
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <motion.button
          className="big-button bg-gradient-to-br from-greenLab to-mintLab py-4 text-ink text-lg"
          onClick={() => onSelectLevel("easy")}
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="mr-2 text-2xl">🌱</span> Gán nhãn cơ bản
          <span className="mt-1 block font-semibold text-ink/60 text-xs">
            Độ khó: Dễ (Nhiều nhãn rõ ràng)
          </span>
        </motion.button>
        <motion.button
          className="big-button bg-gradient-to-br from-purpleLab to-pinkLab py-4 text-lg text-white"
          onClick={() => onSelectLevel("hard")}
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="mr-2 text-2xl">🔥</span> Dữ liệu nhiễu
          <span className="mt-1 block font-semibold text-white/70 text-xs">
            Độ khó: Khó (Nhiều nhãn dễ nhầm)
          </span>
        </motion.button>
      </div>
    </div>
  );
}
