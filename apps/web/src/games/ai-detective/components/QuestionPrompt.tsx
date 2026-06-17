import { useTranslation } from "react-i18next";
import { TTSButton } from "@/components/TTSButton";
import type { DetectiveQuestion } from "../types";

interface QuestionPromptProps {
  index: number;
  question: DetectiveQuestion;
  questionsLength: number;
}

export function QuestionPrompt({
  index,
  question,
  questionsLength,
}: QuestionPromptProps) {
  const { t } = useTranslation("common");

  return (
    <>
      <p className="mb-3 font-black text-muted text-sm">
        {t("gameUi.questionLabel", {
          current: index + 1,
          total: questionsLength,
        })}
      </p>
      <div className="mb-4 text-6xl">{question.emoji}</div>
      <div className="mb-8 flex items-center justify-center gap-3">
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
    </>
  );
}
