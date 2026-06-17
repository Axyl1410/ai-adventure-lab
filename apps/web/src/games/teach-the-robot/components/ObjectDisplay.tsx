import { AnimatePresence, motion } from "motion/react";
import type { Ref } from "react";
import { useTranslation } from "react-i18next";
import { TTSButton } from "@/components/TTSButton";
import type { Item, Level } from "../types";

interface ObjectDisplayProps {
  contentScrollRef: Ref<HTMLDivElement>;
  current: Item;
  index: number;
  level: Level;
}

export function ObjectDisplay({
  contentScrollRef,
  current,
  index,
  level,
}: ObjectDisplayProps) {
  const { t } = useTranslation("gameContent");
  const hintPrefix = t("teachRobot.levelSelect.hintPrefix");

  return (
    <div
      aria-atomic="true"
      aria-live="polite"
      className={`scrollbar-hidden max-h-[min(22rem,55vh)] shrink-0 overflow-y-auto overflow-x-hidden overscroll-contain px-0.5 pb-2 ${
        level === "hard" ? "min-h-[12rem]" : ""
      }`}
      ref={contentScrollRef}
    >
      <AnimatePresence mode="wait">
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col items-center py-2"
          exit={{ opacity: 0, x: -16 }}
          initial={{ opacity: 0, x: 16 }}
          key={index}
          transition={{ duration: 0.2 }}
        >
          <div className="mb-3 grid h-20 w-20 shrink-0 select-none place-items-center rounded-full bg-white text-5xl shadow-md sm:mb-4 sm:h-24 sm:w-24 sm:text-6xl">
            {current.icon}
          </div>

          <div className="mb-3 flex max-w-full shrink-0 flex-wrap items-center justify-center gap-2 sm:gap-3">
            <h2 className="text-center font-black text-2xl text-ink sm:text-3xl">
              {current.label}
            </h2>
            <TTSButton
              autoPlay={true}
              autoPlayRole="content"
              compact={true}
              text={
                current.label +
                (current.hint ? `. ${hintPrefix} ${current.hint}` : "")
              }
            />
          </div>

          {current.hint ? (
            <p className="max-w-md rounded-2xl border border-amber-200/50 bg-amber-50/50 px-3 py-2 text-center font-bold text-amber-600 text-xs italic leading-relaxed sm:px-4 sm:py-2.5">
              💡 {current.hint}
            </p>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
