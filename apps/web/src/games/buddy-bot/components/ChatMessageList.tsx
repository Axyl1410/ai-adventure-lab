import type { Ref } from "react";
import { LoadingBuddy } from "@/components/Feedback";
import { TTSButton } from "@/components/TTSButton";
import { formatBuddyMessage } from "../formatBuddyMessage";
import type { ChatMessage } from "../types";

interface ChatMessageListProps {
  chatRef: Ref<HTMLDivElement>;
  loading: boolean;
  messages: ChatMessage[];
}

export function ChatMessageList({
  chatRef,
  loading,
  messages,
}: ChatMessageListProps) {
  return (
    <div
      className="min-h-[300px] flex-1 overflow-y-auto scroll-smooth rounded-3xl border border-white/40 bg-cream/60 p-3 sm:p-4"
      ref={chatRef}
    >
      {messages.map((msg, i) => (
        <div
          className={`mb-3 flex max-w-[92%] gap-2.5 sm:max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
          key={`${msg.role}-${i}`}
        >
          {msg.role === "assistant" && (
            <div className="mt-1 grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-gradient-to-tr from-skyLab to-purpleLab font-black text-white text-xs shadow-sm">
              🤖
            </div>
          )}
          <div className="flex min-w-0 flex-col gap-1.5">
            <div
              className={`rounded-3xl p-4 font-semibold leading-relaxed ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-skyLab to-blueLab text-white shadow-sm"
                  : "border border-white/60 bg-white text-ink shadow-xs"
              }`}
            >
              {formatBuddyMessage(msg.text)}
            </div>
            {msg.role === "assistant" && (
              <div className="self-start pl-1">
                <TTSButton
                  autoPlay={i === messages.length - 1}
                  compact={true}
                  text={msg.text}
                />
              </div>
            )}
          </div>
        </div>
      ))}
      {loading && <LoadingBuddy />}
    </div>
  );
}
