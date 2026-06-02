import { BookOpen, ShieldCheck, Star } from "lucide-react";

const highlights = [
  {
    icon: BookOpen,
    border: "border-skyLab",
    iconClass: "text-sky-600",
    text: "Bài học ngắn, dễ hiểu cho học sinh tiểu học.",
  },
  {
    icon: ShieldCheck,
    border: "border-greenLab",
    iconClass: "text-green-600",
    text: "Không yêu cầu tên thật hay tài khoản cá nhân.",
  },
  {
    icon: Star,
    border: "border-yellowLab",
    iconClass: "text-orange-500",
    text: "Hoàn thành thử thách để mở sticker Buddy Bot.",
  },
] as const;

export function HomeHighlights() {
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
