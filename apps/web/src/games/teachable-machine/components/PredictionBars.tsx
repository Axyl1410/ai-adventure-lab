import { Sparkles } from "lucide-react";
import { motion } from "motion/react";
import type { ClassConfig, Predictions } from "../types";

interface PredictionBarsProps {
  classes: ClassConfig[];
  predictions: Predictions;
}

export function PredictionBars({ classes, predictions }: PredictionBarsProps) {
  return (
    <div className="space-y-3.5">
      <h3 className="flex items-center gap-1 font-black text-muted text-xs uppercase tracking-wider">
        <Sparkles className="h-3.5 w-3.5 animate-spin text-yellow-500" /> Robot
        đang đoán thử:
      </h3>

      {classes.map((cls) => {
        const prob = predictions[cls.id] || 0;
        const probPercent = Math.round(prob * 100);
        return (
          <div key={cls.id}>
            <div className="mb-1 flex justify-between font-bold text-xs">
              <span className="flex items-center gap-1 text-ink">
                <span className="select-none text-lg">{cls.emoji}</span>
                <span className="max-w-36 truncate font-black">{cls.name}</span>
              </span>
              <span className="font-black text-purpleLab">{probPercent}%</span>
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
  );
}
