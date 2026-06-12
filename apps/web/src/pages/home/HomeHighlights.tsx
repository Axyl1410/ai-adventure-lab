import { BookOpen, ShieldCheck, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

export function HomeHighlights() {
  const { t } = useTranslation("home");

  const highlights = [
    {
      icon: BookOpen,
      border: "border-skyLab",
      iconClass: "text-sky-600",
      text: t("highlights.shortLessons"),
    },
    {
      icon: ShieldCheck,
      border: "border-greenLab",
      iconClass: "text-green-600",
      text: t("highlights.noPii"),
    },
    {
      icon: Star,
      border: "border-yellowLab",
      iconClass: "text-orange-500",
      text: t("highlights.earnStickers"),
    },
  ] as const;

  return (
    <section className="mt-6 grid gap-3 sm:grid-cols-3">
      {highlights.map(({ icon: Icon, border, iconClass, text }) => (
        <div
          className={`flex items-center gap-2 rounded-3xl border-2 ${border} bg-white px-4 py-3.5 font-bold text-ink shadow-sm`}
          key={text}
        >
          <Icon className={`h-6 w-6 shrink-0 ${iconClass}`} />
          <span>{text}</span>
        </div>
      ))}
    </section>
  );
}
