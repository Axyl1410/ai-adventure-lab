import { playTts, stopTts } from "./ttsPlayer";

let activeGameKey: string | null = null;
let instructionKey: string | null = null;
let instructionDone = false;
let instructionPromise: Promise<void> | null = null;

export function isTtsAutoplayEnabled() {
  return localStorage.getItem("ai-lab-tts-autoplay") === "true";
}

export function clearGameTtsAutoplay() {
  activeGameKey = null;
  instructionKey = null;
  instructionDone = false;
  instructionPromise = null;
}

function ensureGameSession(gameKey: string) {
  if (activeGameKey !== gameKey) {
    activeGameKey = gameKey;
    instructionKey = null;
    instructionDone = false;
    instructionPromise = null;
  }
}

/** Read game instruction once per visit / when instruction text changes. */
export function scheduleGameInstructionAutoplay(
  gameKey: string,
  text: string
): void {
  ensureGameSession(gameKey);

  const nextInstructionKey = `${gameKey}::${text.trim()}`;
  if (instructionKey === nextInstructionKey && instructionPromise) {
    return;
  }

  instructionKey = nextInstructionKey;
  instructionDone = false;
  instructionPromise = null;

  if (!(isTtsAutoplayEnabled() && text.trim())) {
    instructionDone = true;
    return;
  }

  instructionPromise = playTts(text.trim()).then(
    () => {
      instructionDone = true;
    },
    () => {
      instructionDone = true;
    }
  );
}

/**
 * Stop current speech when user switches question/tab/content.
 * Keeps "instruction already read" so the next item does not replay the intro.
 */
export function interruptTtsOnTabChange() {
  stopTts();
  instructionPromise = null;
  if (!instructionDone) {
    instructionDone = true;
  }
}

/** Queue content after instruction finishes; replace when text changes. */
export function scheduleGameContentAutoplay(
  text: string,
  replace: boolean
): void {
  if (!(isTtsAutoplayEnabled() && text.trim())) {
    return;
  }

  const play = () => {
    playTts(text.trim(), { replacePending: replace });
  };

  if (instructionPromise && !instructionDone) {
    instructionPromise.then(play).catch(play);
    return;
  }

  play();
}
