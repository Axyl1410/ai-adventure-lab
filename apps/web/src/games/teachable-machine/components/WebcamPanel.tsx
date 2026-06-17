import { Camera } from "lucide-react";
import type { Ref } from "react";
import { useTranslation } from "react-i18next";

interface WebcamPanelProps {
  cameraActive: boolean;
  onStart: () => void;
  onStop: () => void;
  videoRef: Ref<HTMLVideoElement>;
}

export function WebcamPanel({
  videoRef,
  cameraActive,
  onStart,
  onStop,
}: WebcamPanelProps) {
  const { t } = useTranslation("gameContent");

  return (
    <div className="flex flex-shrink-0 flex-col items-center gap-4 rounded-2xl border border-yellowLab/10 bg-cream/40 p-3 sm:flex-row">
      <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-ink shadow-inner sm:aspect-square sm:w-44">
        {!cameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center text-white/50 text-xs">
            <Camera className="mb-1.5 h-8 w-8 animate-pulse" />
            <span>{t("teachableMachine.webcam.cameraOff")}</span>
          </div>
        )}
        <video
          autoPlay={true}
          className={`h-full w-full object-cover ${cameraActive ? "opacity-100" : "opacity-0"}`}
          muted={true}
          playsInline={true}
          ref={videoRef}
        />
      </div>

      <div className="w-full flex-1 space-y-2 text-center sm:text-left">
        <h3 className="flex items-center justify-center gap-1.5 font-black text-ink text-sm sm:justify-start">
          {t("teachableMachine.webcam.title")}
        </h3>
        <p className="font-bold text-[11px] text-muted leading-relaxed">
          {t("teachableMachine.webcam.privacyNote")}
        </p>
        <div className="flex justify-center gap-2 pt-1 sm:justify-start">
          {cameraActive ? (
            <button
              className="big-button min-h-12 bg-gradient-to-r from-redSoft to-pinkLab px-4 py-2 text-ink text-xs shadow-sm"
              onClick={onStop}
              type="button"
            >
              {t("shared.buttons.stopCamera")}
            </button>
          ) : (
            <button
              className="big-button min-h-12 bg-gradient-to-r from-greenLab to-mintLab px-4 py-2 text-ink text-xs shadow-sm"
              onClick={() => void onStart()}
              type="button"
            >
              {t("shared.buttons.startCamera")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
