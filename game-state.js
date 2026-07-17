export const STORAGE_KEY = "ishaan.cosmicRun.v1";

export const TRANSMISSIONS = [
  { id: "build", threshold: 1, label: "Build signal", href: "index.html#work" },
  { id: "research", threshold: 5, label: "Research signal", href: "index.html#research" },
  { id: "ideas", threshold: 15, label: "Ideas signal", href: "index.html#events" },
  { id: "trajectory", threshold: 30, label: "Trajectory signal", href: "index.html#experience" },
  { id: "now", threshold: 50, label: "Now signal", href: "index.html#now" }
];

export const ACHIEVEMENTS = [
  { id: "first-launch", label: "First launch" },
  { id: "first-signal", label: "Signal found" },
  { id: "score-500", label: "Orbital velocity" },
  { id: "score-1000", label: "Escape velocity" },
  { id: "all-transmissions", label: "Field cartographer" }
];

const THEMES = new Set(["system", "dark", "light"]);
const TRANSMISSION_IDS = new Set(TRANSMISSIONS.map(({ id }) => id));
const ACHIEVEMENT_IDS = new Set(ACHIEVEMENTS.map(({ id }) => id));

const safeInteger = (value) => {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0
    ? Math.min(Math.floor(number), 9_999_999)
    : 0;
};

const safeIdList = (value, allowed) => Array.isArray(value)
  ? [...new Set(value.filter((id) => allowed.has(id)))]
  : [];

export function createDefaultGameState() {
  return {
    version: 1,
    highScore: 0,
    totalRuns: 0,
    totalSignals: 0,
    unlockedTransmissions: [],
    achievements: [],
    settings: {
      theme: "system",
      sound: true
    }
  };
}

export function sanitizeGameState(value) {
  const fallback = createDefaultGameState();
  if (!value || typeof value !== "object" || value.version !== 1) return fallback;

  return {
    version: 1,
    highScore: safeInteger(value.highScore),
    totalRuns: safeInteger(value.totalRuns),
    totalSignals: safeInteger(value.totalSignals),
    unlockedTransmissions: safeIdList(value.unlockedTransmissions, TRANSMISSION_IDS),
    achievements: safeIdList(value.achievements, ACHIEVEMENT_IDS),
    settings: {
      theme: THEMES.has(value.settings?.theme) ? value.settings.theme : "system",
      sound: value.settings?.sound !== false
    }
  };
}

export function loadGameState(storage = window.localStorage) {
  try {
    return sanitizeGameState(JSON.parse(storage.getItem(STORAGE_KEY)));
  } catch (_) {
    return createDefaultGameState();
  }
}

export function saveGameState(state, storage = window.localStorage) {
  const sanitized = sanitizeGameState(state);
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
  } catch (_) {
    // The game remains playable when storage is blocked or full.
  }
  return sanitized;
}

export function unlockAchievement(state, id) {
  if (!ACHIEVEMENT_IDS.has(id) || state.achievements.includes(id)) return state;
  return { ...state, achievements: [...state.achievements, id] };
}

export function recordRunStart(state) {
  return unlockAchievement(
    { ...state, totalRuns: safeInteger(state.totalRuns + 1) },
    "first-launch"
  );
}

export function recordScore(state, score) {
  let next = { ...state, highScore: Math.max(state.highScore, safeInteger(score)) };
  if (score >= 500) next = unlockAchievement(next, "score-500");
  if (score >= 1000) next = unlockAchievement(next, "score-1000");
  return next;
}

export function recordSignal(state) {
  const totalSignals = safeInteger(state.totalSignals + 1);
  const unlockedTransmissions = TRANSMISSIONS
    .filter(({ threshold }) => totalSignals >= threshold)
    .map(({ id }) => id);
  let next = unlockAchievement(
    { ...state, totalSignals, unlockedTransmissions },
    "first-signal"
  );
  if (unlockedTransmissions.length === TRANSMISSIONS.length) {
    next = unlockAchievement(next, "all-transmissions");
  }
  return next;
}
