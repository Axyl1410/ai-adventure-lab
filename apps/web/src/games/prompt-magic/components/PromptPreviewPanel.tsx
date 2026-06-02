import { Sparkles, Wand2 } from "lucide-react";
import { LoadingBuddy } from "../../../components/Feedback";
import { TTSButton } from "../../../components/TTSButton";

interface PromptPreviewPanelProps {
  loading: boolean;
  onSubmit: () => void;
  prompt: string;
  sparkle: boolean;
}

export function PromptPreviewPanel({
  prompt,
  sparkle,
  loading,
  onSubmit,
}: PromptPreviewPanelProps) {
  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-purpleLab to-pinkLab text-white shadow-soft">
            <Wand2 className="h-6 w-6" />
          </span>
          <h2 className="font-black text-2xl text-ink tracking-tight">
            Prompt của em
          </h2>
        </div>
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center">
          <p className="relative flex-grow break-words rounded-3xl border border-yellowLab/30 bg-cream/70 p-4 font-black text-base text-ink italic leading-relaxed sm:p-5 sm:text-lg">
            "{prompt}"
            {sparkle && (
              <span className="pointer-events-none absolute -top-3 -right-3 animate-sparkle text-3xl">
                ✨
              </span>
            )}
          </p>
          <TTSButton compact={true} text={prompt} />
        </div>
        <button
          className="big-button flex w-full items-center justify-center gap-2 bg-ink py-3.5 text-lg text-white shadow-md hover:bg-ink/90"
          disabled={loading}
          onClick={() => void onSubmit()}
          type="button"
        >
          <Sparkles className="h-5 w-5 fill-yellowLab text-yellowLab" /> Gửi
          Prompt Coach
        </button>
      </div>

      {loading && (
        <div className="mt-5">
          <LoadingBuddy />
        </div>
      )}
    </>
  );
}
