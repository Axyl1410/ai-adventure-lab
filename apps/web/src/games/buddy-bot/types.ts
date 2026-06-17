export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  text: string;
}

export interface BuddyChip {
  id: string;
  text: string;
}
