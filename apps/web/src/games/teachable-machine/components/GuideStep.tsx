interface GuideStepProps {
  color: string;
  desc: string;
  emoji: string;
  step: number;
  title: string;
}

export function GuideStep({ step, emoji, title, desc, color }: GuideStepProps) {
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
