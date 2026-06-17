import { AlertTriangle } from "lucide-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { TTSButton } from "@/components/TTSButton";
import type { OopsQuestion } from "../types";

interface AiClaimPromptProps {
  index: number;
  question: OopsQuestion;
  questionsLength: number;
}

export function AiClaimPrompt({
  index,
  question,
  questionsLength,
}: AiClaimPromptProps) {
  const { t: tCommon } = useTranslation("common");
  const { t } = useTranslation("gameContent");

  return (
    <>
      <p className="mb-3 font-black text-muted text-sm">
        {tCommon("gameUi.questionLabel", {
          current: index + 1,
          total: questionsLength,
        })}
      </p>
      <div className="mb-4 flex justify-center">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
        >
          <AlertTriangle className="h-12 w-12 text-orange-400" />
        </motion.div>
      </div>
      <div className="mb-6 rounded-2xl border border-yellowLab/30 bg-cream/80 p-5">
        <p className="mb-2 font-black text-muted text-sm">
          {t("oopsAi.aiSays")}
        </p>
        <div className="flex items-center justify-center gap-3">
          <p className="font-black text-2xl text-ink leading-relaxed md:text-3xl">
            "{question.text}"
          </p>
          <TTSButton
            autoPlay={true}
            autoPlayRole="content"
            compact={true}
            text={question.text}
          />
        </div>
      </div>
    </>
  );
}
