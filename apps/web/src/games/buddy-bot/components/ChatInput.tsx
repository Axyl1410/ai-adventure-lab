import { Send } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ChatInputProps {
  input: string;
  loading: boolean;
  onInputChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSend: () => void;
}

export function ChatInput({
  input,
  loading,
  onInputChange,
  onKeyDown,
  onSend,
}: ChatInputProps) {
  const { t } = useTranslation("gameContent");

  return (
    <>
      <p className="mt-3 rounded-2xl border border-yellowLab/30 bg-yellowLab/15 px-4 py-2 font-black text-ink text-xs">
        🔒 Không nhập tên thật, số điện thoại, địa chỉ hoặc tên trường của em.
      </p>
      <div className="sticky bottom-0 mt-2 flex gap-2.5 rounded-2xl bg-white/85 pt-2 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:mt-3">
        <label className="sr-only" htmlFor="buddy-chat-input">
          {t("buddyBot.chatInput.placeholder")}
        </label>
        <input
          className="min-h-13 flex-1 rounded-2xl border-2 border-skyLab/25 px-5 font-semibold text-ink transition-all duration-300 hover:border-skyLab/40 focus:border-skyLab focus:outline-none focus:ring-4 focus:ring-skyLab/15"
          id="buddy-chat-input"
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={t("buddyBot.chatInput.placeholder")}
          value={input}
        />
        <button
          aria-label={t("buddyBot.chatInput.sendAriaLabel")}
          className="big-button bg-gradient-to-r from-ink to-ink/90 px-5 text-white shadow-md disabled:opacity-50"
          disabled={loading || !input.trim()}
          onClick={onSend}
          type="button"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </>
  );
}
