interface PredictionSummaryProps {
  emoji: string;
  name: string;
}

export function PredictionSummary({ emoji, name }: PredictionSummaryProps) {
  return (
    <div className="rounded-2xl border border-skyLab/20 bg-skyLab/15 p-2.5 font-bold text-[11px] text-ink leading-relaxed shadow-xs">
      🤖 AI phân loại:{" "}
      <span className="font-black text-purple-700">
        {emoji} {name}
      </span>
      <p className="mt-0.5 font-bold text-[10px] text-muted">
        💡 Thử giơ các đồ vật khác hoặc thay đổi khuôn mặt xem AI có bị đoán
        nhầm không nhé!
      </p>
    </div>
  );
}
