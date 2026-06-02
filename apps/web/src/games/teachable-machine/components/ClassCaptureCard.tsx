import { Camera, Trash2, X } from "lucide-react";
import type { ClassConfig, Example } from "../types";

interface ClassCaptureCardProps {
  cameraActive: boolean;
  classExamples: Example[];
  cls: ClassConfig;
  onCapture: (classId: number) => void;
  onClearClass: (classId: number) => void;
  onDeleteExample: (id: string) => void;
  onRename: (id: number, name: string) => void;
}

export function ClassCaptureCard({
  cls,
  classExamples,
  cameraActive,
  onCapture,
  onDeleteExample,
  onClearClass,
  onRename,
}: ClassCaptureCardProps) {
  return (
    <div
      className={`flex min-h-0 flex-col justify-between rounded-2xl border p-3 ${cls.color} ${cls.borderColor}`}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 rounded-xl border border-white bg-white/70 px-2 py-1">
          <span className="select-none text-xl">{cls.emoji}</span>
          <input
            aria-label={`Tên nhóm ${cls.id}`}
            className="w-full bg-transparent font-black text-ink text-xs placeholder-ink/40 focus:outline-none"
            onChange={(e) => onRename(cls.id, e.target.value)}
            placeholder={`Nhóm ${cls.id}`}
            value={cls.name}
          />
        </div>

        <button
          className="big-button flex min-h-12 w-full items-center justify-center gap-1.5 border border-white bg-white px-3 py-2 font-black text-ink text-xs shadow-xs hover:bg-white/90 disabled:opacity-40"
          disabled={!cameraActive}
          onClick={() => onCapture(cls.id)}
          type="button"
        >
          <Camera className="h-3.5 w-3.5" /> Chụp 1 ảnh
        </button>

        <div className="flex items-center justify-between px-1 font-black text-[10px] text-muted">
          <span>📸 Đã chụp: {classExamples.length} ảnh</span>
          {classExamples.length > 0 && (
            <button
              aria-label={`Xóa toàn bộ ảnh ví dụ của nhóm ${cls.name}`}
              className="flex items-center gap-0.5 font-bold text-red-500 hover:text-red-700"
              onClick={() => onClearClass(cls.id)}
              title="Xóa ví dụ nhóm này"
              type="button"
            >
              <Trash2 className="h-3 w-3" /> Xóa ảnh
            </button>
          )}
        </div>
      </div>

      <div className="mt-2.5 flex h-14 min-w-0 items-center gap-1.5 overflow-x-auto rounded-xl border border-white/50 bg-white/40 px-1.5 shadow-inner">
        {classExamples.length === 0 ? (
          <div className="mx-auto text-center font-bold text-[10px] text-muted/60 italic">
            Chưa có ảnh
          </div>
        ) : (
          classExamples.map((ex) => (
            <div
              className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg border border-white/80 shadow-xs"
              key={ex.id}
            >
              <img
                alt="Thumbnail"
                className="h-full w-full object-cover"
                src={ex.thumbnail}
              />
              <button
                aria-label={`Xóa ảnh ví dụ khỏi nhóm ${cls.name}`}
                className="absolute top-0 right-0 rounded-bl-lg bg-red-500 p-0.5 text-white shadow-xs transition-colors hover:bg-red-700"
                onClick={() => onDeleteExample(ex.id)}
                type="button"
              >
                <X className="h-2 w-2" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
