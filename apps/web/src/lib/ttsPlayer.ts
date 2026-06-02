import { speak as apiSpeak } from "./api";

export type TtsPlayState = "idle" | "loading" | "playing";

type QueueItem = {
  text: string;
  replacePending: boolean;
  resolve: () => void;
  reject: (error: unknown) => void;
};

type StateListener = (state: TtsPlayState, activeText: string | null) => void;

let backendAvailable: boolean | null = null;
let backendCheckPromise: Promise<boolean> | null = null;

let cancelToken = 0;
let queue: QueueItem[] = [];
let workerRunning = false;
let activeAudio: HTMLAudioElement | null = null;
let activeText: string | null = null;
let playState: TtsPlayState = "idle";
const listeners = new Set<StateListener>();

function getCurrentVoice() {
  const gender = localStorage.getItem("ai-lab-tts-gender") || "female";
  return gender === "male" ? "minhkhang" : "ngochuyen";
}

function notify() {
  for (const listener of listeners) {
    listener(playState, activeText);
  }
}

function setState(state: TtsPlayState, text: string | null) {
  playState = state;
  activeText = text;
  notify();
}

export function subscribeTtsState(listener: StateListener) {
  listeners.add(listener);
  listener(playState, activeText);
  return () => {
    listeners.delete(listener);
  };
}

export function resetTtsBackendCache() {
  backendAvailable = null;
  backendCheckPromise = null;
}

function cancelPlayback() {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.onended = null;
    activeAudio.onerror = null;
    activeAudio.src = "";
    activeAudio = null;
  }
  window.speechSynthesis?.cancel();
}

function rejectQueuedItems(error: unknown) {
  for (const item of queue) {
    item.reject(error);
  }
  queue = [];
}

async function checkBackend(): Promise<boolean> {
  if (backendAvailable !== null) {
    return backendAvailable;
  }
  if (backendCheckPromise) {
    return backendCheckPromise;
  }

  backendCheckPromise = (async () => {
    try {
      const result = await Promise.race([
        apiSpeak(".", getCurrentVoice()),
        new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), 4000)
        ),
      ]);
      const ok = !!(result && (result as { audioUrl?: string }).audioUrl);
      backendAvailable = ok;
      return ok;
    } catch {
      backendAvailable = false;
      return false;
    } finally {
      backendCheckPromise = null;
    }
  })();

  return backendCheckPromise;
}

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis?.getVoices() ?? [];
    if (voices.length > 0) {
      return resolve(voices);
    }
    const handler = () => resolve(window.speechSynthesis.getVoices());
    window.speechSynthesis?.addEventListener("voiceschanged", handler, {
      once: true,
    });
    setTimeout(() => resolve(window.speechSynthesis?.getVoices() ?? []), 1200);
  });
}

function pickVoice(
  voices: SpeechSynthesisVoice[],
  isMale: boolean
): SpeechSynthesisVoice | undefined {
  const viVoices = voices.filter(
    (v) =>
      v.lang === "vi-VN" ||
      v.lang === "vi" ||
      v.name.toLowerCase().includes("vietnam") ||
      v.name.toLowerCase().includes("vietnamese")
  );
  if (viVoices.length === 0) {
    return;
  }

  const femaleKeywords = [
    "hoaimy",
    "hoai my",
    "hoai_my",
    "thu",
    "female",
    "woman",
    "girl",
  ];
  const maleKeywords = [
    "namminh",
    "nam minh",
    "nam_minh",
    "male",
    "man",
    "boy",
  ];
  const targetKeywords = isMale ? maleKeywords : femaleKeywords;
  const found = viVoices.find((v) =>
    targetKeywords.some((kw) =>
      v.name
        .toLowerCase()
        .replace(/\s+/gu, "")
        .includes(kw.replace(/\s+/gu, ""))
    )
  );
  if (found) {
    return found;
  }
  if (isMale && viVoices.length >= 2) {
    return viVoices[1];
  }
  return viVoices[0];
}

function waitForAudioReady(
  audio: HTMLAudioElement,
  token: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (token !== cancelToken) {
      reject(new Error("cancelled"));
      return;
    }

    const cleanup = () => {
      audio.removeEventListener("canplaythrough", onReady);
      audio.removeEventListener("error", onError);
    };

    const onReady = () => {
      cleanup();
      if (token !== cancelToken) {
        reject(new Error("cancelled"));
        return;
      }
      resolve();
    };

    const onError = () => {
      cleanup();
      reject(new Error("load_failed"));
    };

    if (audio.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
      resolve();
      return;
    }

    audio.addEventListener("canplaythrough", onReady, { once: true });
    audio.addEventListener("error", onError, { once: true });
    audio.load();
  });
}

function playUntilEnd(audio: HTMLAudioElement, token: number): Promise<void> {
  return new Promise((resolve, reject) => {
    if (token !== cancelToken) {
      reject(new Error("cancelled"));
      return;
    }

    audio.onended = () => {
      if (token === cancelToken && activeAudio === audio) {
        activeAudio = null;
        resolve();
      }
    };
    audio.onerror = () => {
      if (token === cancelToken) {
        reject(new Error("play_failed"));
      }
    };

    audio.play().catch(reject);
  });
}

async function speakWithBrowser(text: string, token: number): Promise<void> {
  if (!window.speechSynthesis) {
    return;
  }
  window.speechSynthesis.cancel();

  const gender = localStorage.getItem("ai-lab-tts-gender") || "female";
  const isMale = gender === "male";
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "vi-VN";
  utter.rate = isMale ? 0.85 : 0.95;
  utter.pitch = isMale ? 0.6 : 1.15;

  const voices = await loadVoices();
  if (token !== cancelToken) {
    throw new Error("cancelled");
  }

  const selectedVoice = pickVoice(voices, isMale);
  if (selectedVoice) {
    utter.voice = selectedVoice;
  }

  setState("playing", text);

  await new Promise<void>((resolve, reject) => {
    if (token !== cancelToken) {
      reject(new Error("cancelled"));
      return;
    }

    utter.onend = () => {
      if (token === cancelToken) {
        resolve();
      }
    };
    utter.onerror = () => {
      if (token === cancelToken) {
        reject(new Error("speech_failed"));
      }
    };

    window.speechSynthesis.speak(utter);
  });
}

async function speakWithBackend(text: string, token: number): Promise<void> {
  const voice = getCurrentVoice();
  const result = await apiSpeak(text, voice);
  if (token !== cancelToken) {
    throw new Error("cancelled");
  }

  if (!result?.audioUrl) {
    backendAvailable = false;
    await speakWithBrowser(text, token);
    return;
  }

  const audio = new Audio(result.audioUrl);
  activeAudio = audio;

  await waitForAudioReady(audio, token);
  if (token !== cancelToken) {
    throw new Error("cancelled");
  }

  setState("playing", text);
  await playUntilEnd(audio, token);
}

async function speakOnce(text: string, token: number): Promise<void> {
  setState("loading", text);

  const useBackend = await checkBackend();
  if (token !== cancelToken) {
    throw new Error("cancelled");
  }

  if (useBackend) {
    await speakWithBackend(text, token);
    return;
  }

  await speakWithBrowser(text, token);
}

async function drainQueue() {
  if (workerRunning) {
    return;
  }
  workerRunning = true;

  try {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) {
        break;
      }
      const token = cancelToken;

      try {
        await speakOnce(item.text, token);
        if (token === cancelToken) {
          item.resolve();
        } else {
          item.reject(new Error("cancelled"));
        }
      } catch (error) {
        if (token === cancelToken) {
          item.reject(error);
        } else {
          item.reject(new Error("cancelled"));
        }
      }
    }

    cancelPlayback();
    setState("idle", null);
  } finally {
    workerRunning = false;
    if (queue.length > 0) {
      void drainQueue();
    }
  }
}

export function playTts(
  text: string,
  options?: { replacePending?: boolean }
): Promise<void> {
  const trimmed = text.trim();
  if (!trimmed) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    if (options?.replacePending) {
      cancelToken++;
      cancelPlayback();
      rejectQueuedItems(new Error("replaced"));
    }

    queue.push({
      text: trimmed,
      replacePending: options?.replacePending ?? false,
      resolve,
      reject,
    });
    void drainQueue();
  });
}

export function stopTts() {
  cancelToken++;
  cancelPlayback();
  rejectQueuedItems(new Error("stopped"));
  setState("idle", null);
  workerRunning = false;
}

export function isTtsPlayingText(text: string) {
  return playState === "playing" && activeText === text.trim();
}

export function isTtsLoadingText(text: string) {
  return playState === "loading" && activeText === text.trim();
}
