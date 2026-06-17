import { ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { TTSButton } from "@/components/TTSButton";
import type { Scenario } from "../types";

interface ScenarioPromptProps {
  deckLength: number;
  index: number;
  scenario: Scenario;
}

export function ScenarioPrompt({
  deckLength,
  index,
  scenario,
}: ScenarioPromptProps) {
  const { t } = useTranslation("common");

  return (
    <>
      <p className="mb-3 font-black text-muted text-sm">
        {t("gameUi.missionLabel", {
          current: index + 1,
          total: deckLength,
        })}
      </p>
      <div className="mx-auto mb-5 grid h-24 w-24 place-items-center rounded-full bg-greenLab/15 text-6xl shadow-sm">
        {scenario.emoji}
      </div>
      <div className="mb-7 flex items-center justify-center gap-3 rounded-3xl border border-greenLab/20 bg-cream/70 p-5">
        <ShieldCheck className="h-8 w-8 text-green-600" />
        <p className="font-black text-2xl text-ink leading-relaxed">
          {scenario.text}
        </p>
        <TTSButton
          autoPlay={true}
          autoPlayRole="content"
          compact={true}
          text={scenario.text}
        />
      </div>
    </>
  );
}
