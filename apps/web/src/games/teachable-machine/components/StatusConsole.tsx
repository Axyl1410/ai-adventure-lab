import { TTSButton } from "../../../components/TTSButton";

interface StatusConsoleProps {
  status: string;
}

export function StatusConsole({ status }: StatusConsoleProps) {
  return (
    <div className="relative rounded-2xl border border-yellowLab/20 bg-cream/70 p-3 shadow-xs">
      <p className="font-bold text-ink text-xs leading-relaxed">{status}</p>
      <div className="absolute right-2 bottom-2">
        <TTSButton
          autoPlay={true}
          autoPlayRole="content"
          compact={true}
          text={status}
        />
      </div>
    </div>
  );
}
