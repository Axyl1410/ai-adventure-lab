import { BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { TTSButton } from "@/components/TTSButton";
import { GuideStep } from "./GuideStep";

const GUIDE_STEPS = ["step_1", "step_2", "step_3", "step_4"] as const;
const STEP_COLORS = [
  "bg-skyLab",
  "bg-purpleLab",
  "bg-greenLab",
  "bg-pinkLab",
] as const;
const STEP_EMOJIS = ["🏷️", "📸", "🧠", "🔮"] as const;

export function GuideBook() {
  const { t } = useTranslation("gameContent");

  return (
    <div className="min-h-0 space-y-2.5 overflow-y-auto pr-1">
      <div className="flex flex-shrink-0 items-center justify-between border-gray-100 border-b pb-1.5">
        <h3 className="flex items-center gap-1 font-black text-muted text-xs uppercase tracking-wider">
          <BookOpen className="h-3.5 w-3.5 text-skyLab" />{" "}
          {t("teachableMachine.guide.title")}
        </h3>
        <TTSButton compact={true} text={t("teachableMachine.guide.ttsText")} />
      </div>

      <div className="space-y-2">
        {GUIDE_STEPS.map((stepKey, index) => (
          <GuideStep
            color={STEP_COLORS[index]}
            desc={t(`teachableMachine.guide.steps.${stepKey}.desc`)}
            emoji={STEP_EMOJIS[index]}
            key={stepKey}
            step={index + 1}
            title={t(`teachableMachine.guide.steps.${stepKey}.title`)}
          />
        ))}
      </div>
    </div>
  );
}
