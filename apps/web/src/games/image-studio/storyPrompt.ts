export function buildStoryPrompt(promptUsed: string): string {
  return `Hãy kể một câu chuyện ngắn khoảng 4-6 câu thật vui vẻ, dễ thương và có bài học ý nghĩa về bức tranh này: ${promptUsed}`;
}

export function getBuddyStoryState(promptUsed: string) {
  return { storyPrompt: buildStoryPrompt(promptUsed) };
}
