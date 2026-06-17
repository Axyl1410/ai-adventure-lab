import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { askBuddy } from "@/lib/api";
import {
  chipTranslationKey,
  getDefaultChipIds,
  getFollowUpChipIds,
  resolveChipGroup,
} from "./chipSuggestions";
import type { BuddyChip, ChatMessage } from "./types";

interface SessionLike {
  id: string;
}

function localizeChips(
  t: ReturnType<typeof useTranslation>["t"],
  chipIds: string[]
): BuddyChip[] {
  return chipIds.map((id) => ({
    id,
    text: t(chipTranslationKey(resolveChipGroup(id), id)),
  }));
}

export function useBuddyChat(session: SessionLike | null) {
  const { t, i18n } = useTranslation("gameContent");
  const location = useLocation();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: t("buddyBot.initialMessage") },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeChipIds, setActiveChipIds] =
    useState<string[]>(getDefaultChipIds);
  const chatRef = useRef<HTMLDivElement>(null);
  const processedStory = useRef(false);

  const activeChips = useMemo(
    () => localizeChips(t, activeChipIds),
    [activeChipIds, t, i18n.language]
  );

  useEffect(() => {
    setMessages((items) => {
      if (items.length === 1 && items[0]?.role === "assistant") {
        return [{ role: "assistant", text: t("buddyBot.initialMessage") }];
      }
      return items;
    });
  }, [i18n.language, t]);

  const send = useCallback(
    async (text?: string) => {
      const messageText = (text ?? input).trim();
      if (!(session && messageText)) {
        return;
      }
      setInput("");
      setMessages((items) => [...items, { role: "user", text: messageText }]);
      setLoading(true);
      setActiveChipIds(getFollowUpChipIds(messageText));

      const answer = await askBuddy(session.id, messageText)
        .then((r) => r.answer)
        .catch(() => t("buddyBot.errorMessage"))
        .finally(() => setLoading(false));

      setMessages((items) => [...items, { role: "assistant", text: answer }]);
    },
    [session, input, t]
  );

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    const state = location.state as { storyPrompt?: string } | null;
    if (session && state?.storyPrompt && !processedStory.current) {
      processedStory.current = true;
      const prompt = state.storyPrompt;
      window.history.replaceState({}, document.title);
      send(prompt);
    }
  }, [session, location.state, send]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return {
    messages,
    input,
    setInput,
    loading,
    activeChips,
    chatRef,
    send,
    handleKeyDown,
  };
}
