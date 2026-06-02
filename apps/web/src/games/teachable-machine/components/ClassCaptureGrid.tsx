import type { ClassConfig, Example } from "../types";
import { ClassCaptureCard } from "./ClassCaptureCard";

interface ClassCaptureGridProps {
  cameraActive: boolean;
  classes: ClassConfig[];
  examples: Example[];
  onCapture: (classId: number) => void;
  onClearClass: (classId: number) => void;
  onDeleteExample: (id: string) => void;
  onRename: (id: number, name: string) => void;
}

export function ClassCaptureGrid({
  classes,
  examples,
  cameraActive,
  onCapture,
  onDeleteExample,
  onClearClass,
  onRename,
}: ClassCaptureGridProps) {
  return (
    <div className="my-3.5 grid grid-cols-1 gap-3 md:grid-cols-3">
      {classes.map((cls) => (
        <ClassCaptureCard
          cameraActive={cameraActive}
          classExamples={examples.filter((ex) => ex.classId === cls.id)}
          cls={cls}
          key={cls.id}
          onCapture={onCapture}
          onClearClass={onClearClass}
          onDeleteExample={onDeleteExample}
          onRename={onRename}
        />
      ))}
    </div>
  );
}
