import { GameShell } from "@/components/GameShell";
import { useSession } from "@/hooks/useSession";
import { BuddySidebar } from "./components/BuddySidebar";
import { ChatInput } from "./components/ChatInput";
import { ChatMessageList } from "./components/ChatMessageList";
import { SuggestedChips } from "./components/SuggestedChips";
import { useBuddyChat } from "./useBuddyChat";

export function BuddyBotGame() {
  const { session } = useSession();
  const chat = useBuddyChat(session);

  return (
    <GameShell
      instruction="Trò chuyện với robot học tập Buddy Bot."
      subtitle="Trò chuyện với robot học tập an toàn."
      title="💬 Buddy Bot Trò Chuyện"
    >
      <section className="grid flex-1 gap-5 lg:grid-cols-[220px_1fr]">
        <BuddySidebar loading={chat.loading} />
        <div className="lab-card flex min-h-[62dvh] flex-col bg-white/80 p-3 sm:p-5 lg:min-h-[560px]">
          <SuggestedChips
            chips={chat.activeChips}
            onChipClick={(chip) => chat.send(chip)}
          />
          <ChatMessageList
            chatRef={chat.chatRef}
            loading={chat.loading}
            messages={chat.messages}
          />
          <ChatInput
            input={chat.input}
            loading={chat.loading}
            onInputChange={chat.setInput}
            onKeyDown={chat.handleKeyDown}
            onSend={() => chat.send()}
          />
        </div>
      </section>
    </GameShell>
  );
}
