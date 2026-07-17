import "./trex-runner.js";
import {
  ACHIEVEMENTS,
  TRANSMISSIONS,
  loadGameState,
  recordRunStart,
  recordScore,
  recordSignal,
  saveGameState
} from "./game-state.js";
import {
  applyDistanceScore,
  collectSignal,
  createRunState,
  getBiome,
  missSignal
} from "./game-mechanics.js";

document.documentElement.classList.add("game-ready");

const gameRoot = document.querySelector(".trex-game");
const highScoreElement = document.querySelector("[data-high-score]");
const scoreElement = document.querySelector("[data-score]");
const achievementElement = document.querySelector("[data-latest-achievement]");
const promptElement = document.querySelector("[data-game-prompt]");
const announcementElement = document.querySelector("[data-game-announcement]");
const pauseButton = document.querySelector('[data-game-action="pause"]');
const soundButton = document.querySelector("[data-sound-toggle]");
const soundLabel = document.querySelector("[data-sound-label]");
const themeButton = document.querySelector("[data-theme-toggle]");
const themeLabel = document.querySelector("[data-theme-label]");
const gameFrame = document.querySelector("[data-game-frame]");
const biomeElement = document.querySelector("[data-biome]");
const signalsElement = document.querySelector("[data-signals]");
const multiplierElement = document.querySelector("[data-multiplier]");
const transmissionsElement = document.querySelector("[data-transmissions]");
const achievementsElement = document.querySelector("[data-achievements]");
const formatScore = (score) => String(Math.max(0, Math.floor(score))).padStart(5, "0");
const themeOrder = ["system", "dark", "light"];

let gameState = loadGameState();
let runState = createRunState();

function announce(message) {
  if (!announcementElement) return;
  announcementElement.textContent = "";
  window.requestAnimationFrame(() => { announcementElement.textContent = message; });
}

function renderRunState() {
  if (scoreElement) scoreElement.textContent = formatScore(runState.totalScore);
  if (signalsElement) signalsElement.textContent = String(runState.signals);
  if (multiplierElement) multiplierElement.textContent = `${runState.combo}×`;
  const biome = getBiome(runState.totalScore);
  if (gameFrame) gameFrame.dataset.biomeId = biome.id;
  if (biomeElement) biomeElement.textContent = biome.label;
}

function renderPersistentState() {
  if (highScoreElement) highScoreElement.textContent = formatScore(gameState.highScore);
  const latestId = gameState.achievements.at(-1);
  const latest = ACHIEVEMENTS.find(({ id }) => id === latestId);
  if (achievementElement && latest) {
    achievementElement.textContent = `${latest.label} recovered. Progress is saved in this browser.`;
  }

  if (transmissionsElement) {
    transmissionsElement.replaceChildren(...TRANSMISSIONS.map((transmission) => {
      const item = document.createElement("li");
      const unlocked = gameState.unlockedTransmissions.includes(transmission.id);
      item.classList.toggle("is-unlocked", unlocked);
      if (unlocked) {
        const link = document.createElement("a");
        link.href = transmission.href;
        link.textContent = transmission.label;
        item.append(link);
      } else {
        item.append(`Recover ${transmission.threshold} signal${transmission.threshold === 1 ? "" : "s"}`);
      }
      return item;
    }));
  }

  if (achievementsElement) {
    achievementsElement.replaceChildren(...ACHIEVEMENTS.map((achievement) => {
      const item = document.createElement("li");
      item.classList.toggle("is-unlocked", gameState.achievements.includes(achievement.id));
      item.textContent = achievement.label;
      return item;
    }));
  }
}

function announceNewAchievement(previous, next) {
  const newId = next.achievements.find((id) => !previous.achievements.includes(id));
  const achievement = ACHIEVEMENTS.find(({ id }) => id === newId);
  if (achievement) announce(`Achievement unlocked: ${achievement.label}.`);
}

function runner() {
  return window.TrexRunner;
}

function applySettings() {
  const { theme, sound } = gameState.settings;
  if (theme === "system") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;
  if (themeLabel) themeLabel.textContent = `Theme: ${theme}`;
  if (themeButton) themeButton.setAttribute("aria-label", `Color theme: ${theme}. Activate to switch.`);
  if (soundLabel) soundLabel.textContent = sound ? "Sound on" : "Sound off";
  if (soundButton) soundButton.setAttribute("aria-pressed", String(!sound));

  const context = runner()?.audioContext;
  if (context && !sound && context.state === "running") context.suspend();
  if (context && sound && context.state === "suspended") context.resume();
}

function updateSettings(settings) {
  gameState = saveGameState({ ...gameState, settings: { ...gameState.settings, ...settings } });
  applySettings();
}

function dispatchRunnerKey(type, keyCode) {
  document.dispatchEvent(new KeyboardEvent(type, {
    keyCode,
    which: keyCode,
    bubbles: true,
    cancelable: true
  }));
}

function jump() {
  dispatchRunnerKey("keydown", 32);
  window.setTimeout(() => dispatchRunnerKey("keyup", 32), 80);
}

function togglePause() {
  const instance = runner();
  if (!instance || instance.crashed || !instance.activated) return;
  if (instance.paused) instance.play();
  else instance.stop();
}

function restart() {
  const instance = runner();
  if (!instance) return;
  if (instance.crashed) instance.restart();
}

gameRoot?.addEventListener("cosmicrun:start", () => {
  runState = createRunState();
  const previous = gameState;
  gameState = saveGameState(recordRunStart(gameState));
  renderPersistentState();
  announceNewAchievement(previous, gameState);
  if (promptElement) promptElement.hidden = true;
  if (pauseButton) pauseButton.innerHTML = '<span aria-hidden="true">Ⅱ</span> Pause';
  renderRunState();
});

gameRoot?.addEventListener("cosmicrun:score", ({ detail }) => {
  runState = applyDistanceScore(runState, detail.score);
  if ((runState.totalScore >= 500 && !gameState.achievements.includes("score-500")) ||
      (runState.totalScore >= 1000 && !gameState.achievements.includes("score-1000"))) {
    const previous = gameState;
    gameState = saveGameState(recordScore(gameState, runState.totalScore));
    renderPersistentState();
    announceNewAchievement(previous, gameState);
  }
  renderRunState();
});

gameRoot?.addEventListener("cosmicrun:signalcollect", () => {
  runState = collectSignal(runState);
  const previous = gameState;
  gameState = saveGameState(recordSignal(gameState));
  renderRunState();
  renderPersistentState();
  if (gameState.achievements.length > previous.achievements.length) announceNewAchievement(previous, gameState);
  else announce(`Signal recovered. Multiplier ${runState.combo} times.`);
});

gameRoot?.addEventListener("cosmicrun:signalmiss", () => {
  if (runState.combo > 1) announce("Signal missed. Multiplier reset.");
  runState = missSignal(runState);
  renderRunState();
});

gameRoot?.addEventListener("cosmicrun:gameover", () => {
  gameState = saveGameState(recordScore(gameState, runState.totalScore));
  renderPersistentState();
  if (promptElement) {
    promptElement.hidden = false;
    promptElement.textContent = "Signal lost — press R or tap the runner to relaunch";
  }
  announce(`Game over. Score ${runState.totalScore}. High score ${gameState.highScore}.`);
});

gameRoot?.addEventListener("cosmicrun:pause", () => {
  if (pauseButton) pauseButton.innerHTML = '<span aria-hidden="true">▶</span> Resume';
});

gameRoot?.addEventListener("cosmicrun:resume", () => {
  if (pauseButton) pauseButton.innerHTML = '<span aria-hidden="true">Ⅱ</span> Pause';
});

document.querySelectorAll("[data-game-action]").forEach((button) => {
  const action = button.dataset.gameAction;
  if (action === "jump") button.addEventListener("click", jump);
  if (action === "pause") button.addEventListener("click", togglePause);
  if (action === "duck") {
    button.addEventListener("pointerdown", () => dispatchRunnerKey("keydown", 40));
    ["pointerup", "pointercancel", "pointerleave"].forEach((type) => {
      button.addEventListener(type, () => dispatchRunnerKey("keyup", 40));
    });
  }
});

document.addEventListener("keydown", (event) => {
  if (event.repeat) return;
  if (event.key.toLowerCase() === "p") { event.preventDefault(); togglePause(); }
  if (event.key.toLowerCase() === "r") { event.preventDefault(); restart(); }
  if (event.key.toLowerCase() === "m") {
    event.preventDefault();
    updateSettings({ sound: !gameState.settings.sound });
  }
});

soundButton?.addEventListener("click", () => updateSettings({ sound: !gameState.settings.sound }));
themeButton?.addEventListener("click", () => {
  const index = themeOrder.indexOf(gameState.settings.theme);
  updateSettings({ theme: themeOrder[(index + 1) % themeOrder.length] });
});

renderPersistentState();
renderRunState();
applySettings();
