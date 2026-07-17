import assert from "node:assert/strict";
import test from "node:test";
import {
  STORAGE_KEY,
  createDefaultGameState,
  loadGameState,
  recordRunStart,
  recordScore,
  recordSignal,
  sanitizeGameState,
  saveGameState
} from "../../game-state.js";

function memoryStorage(initialValue = null) {
  let value = initialValue;
  return {
    getItem: () => value,
    setItem: (_key, next) => { value = next; },
    read: () => value
  };
}

test("malformed and unsupported storage recovers to defaults", () => {
  assert.deepEqual(loadGameState(memoryStorage("not json")), createDefaultGameState());
  assert.deepEqual(sanitizeGameState({ version: 99, highScore: 900 }), createDefaultGameState());
});

test("stored values are bounded and unknown identifiers are removed", () => {
  const sanitized = sanitizeGameState({
    version: 1,
    highScore: Infinity,
    totalRuns: -4,
    totalSignals: 8.9,
    unlockedTransmissions: ["build", "unknown", "build"],
    achievements: ["first-launch", "mystery"],
    settings: { theme: "neon", sound: false }
  });

  assert.equal(sanitized.highScore, 0);
  assert.equal(sanitized.totalRuns, 0);
  assert.equal(sanitized.totalSignals, 8);
  assert.deepEqual(sanitized.unlockedTransmissions, ["build"]);
  assert.deepEqual(sanitized.achievements, ["first-launch"]);
  assert.deepEqual(sanitized.settings, { theme: "system", sound: false });
});

test("run, score, and signal milestones unlock once", () => {
  let state = recordRunStart(createDefaultGameState());
  state = recordRunStart(state);
  state = recordScore(state, 1_000);
  for (let index = 0; index < 50; index += 1) state = recordSignal(state);

  assert.equal(state.totalRuns, 2);
  assert.equal(state.highScore, 1_000);
  assert.equal(state.unlockedTransmissions.length, 5);
  assert.deepEqual(state.achievements, [
    "first-launch",
    "score-500",
    "score-1000",
    "first-signal",
    "all-transmissions"
  ]);
});

test("validated progress is written under the versioned key", () => {
  const storage = memoryStorage();
  const saved = saveGameState({ ...createDefaultGameState(), highScore: 321 }, storage);
  assert.equal(saved.highScore, 321);
  assert.equal(JSON.parse(storage.read()).highScore, 321);
  assert.equal(STORAGE_KEY, "ishaan.cosmicRun.v1");
});
