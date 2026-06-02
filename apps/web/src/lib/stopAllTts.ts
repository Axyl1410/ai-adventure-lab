import { clearGameTtsAutoplay } from "./gameTtsAutoplay";
import { stopTts } from "./ttsPlayer";

/** Stop playback and reset per-game instruction/content autoplay state. */
export function stopAllTts() {
  stopTts();
  clearGameTtsAutoplay();
}
