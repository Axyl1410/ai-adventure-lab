import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { askBuddy } from "../../lib/api";
import { getFollowUpChips } from "./chipSuggestions";
import {
  BUDDY_ERROR_MESSAGE,
  DEFAULT_CHIPS,
  INITIAL_ASSISTANT_MESSAGE,
} from "./constants";
import type { ChatMessage } from "./types";

interface SessionLike {
  id: string;
}

export function useBuddyChat(session: SessionLike | null) {
  const location = useLocation();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: INITIAL_ASSISTANT_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeChips, setActiveChips] = useState(DEFAULT_CHIPS);
  const chatRef = useRef<HTMLDivElement>(null);
  const processedStory = useRef(false);

  const send = useCallback(
    async (text?: string) => {
      const messageText = (text ?? input).trim();
      if (!(session && messageText)) {
        return;
      }
      setInput("");
      setMessages((items) => [...items, { role: "user", text: messageText }]);
      setLoading(true);
      setActiveChips(getFollowUpChips(messageText));

      const answer = await askBuddy(session.id, messageText)
        .then((r) => r.answer)
        .catch(() => BUDDY_ERROR_MESSAGE)
        .finally(() => setLoading(false));

      setMessages((items) => [...items, { role: "assistant", text: answer }]);
    },
    [session, input]
  );

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    const state = location.state as { storyPrompt?: string } | null;
    if (session && state?.storyPrompt && !processedStory.current) {
      processedStory.current = true;
      const prompt = state.storyPrompt;
      window.history.replaceState({}, document.title);
      void send(prompt);
    }
  }, [session, location.state, send]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
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
