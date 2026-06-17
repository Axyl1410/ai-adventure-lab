import { useTranslation } from "react-i18next";
import { BuddyBot } from "@/components/BuddyBot";

interface BuddySidebarProps {
  loading: boolean;
}

export function BuddySidebar({ loading }: BuddySidebarProps) {
  const { t } = useTranslation("gameContent");

  return (
    <div className="lab-card hidden place-items-center bg-white/80 p-5 lg:grid">
      <BuddyBot size={190} state={loading ? "thinking" : "happy"} />
      <p className="mt-3 text-center font-bold text-muted text-sm">
        {loading ? t("buddyBot.sidebar.thinking") : t("buddyBot.sidebar.ready")}
      </p>
    </div>
  );
}
