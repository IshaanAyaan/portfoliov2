import "./trex-runner.js";
import {
  ACHIEVEMENTS,
  loadGameState,
  recordRunStart,
  recordScore,
  saveGameState
} from "./game-state.js";

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
const formatScore = (score) => String(Math.max(0, Math.floor(score))).padStart(5, "0");
const themeOrder = ["system", "dark", "light"];

let gameState = loadGameState();
let currentScore = 0;

function renderPersistentState() {
  if (highScoreElement) highScoreElement.textContent = formatScore(gameState.highScore);
  const latestId = gameState.achievements.at(-1);
  const latest = ACHIEVEMENTS.find(({ id }) => id === latestId);
  if (achievementElement && latest) {
    achievementElement.textContent = `${latest.label} recovered. Progress is saved in this browser.`;
  }
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
  currentScore = 0;
  gameState = saveGameState(recordRunStart(gameState));
  renderPersistentState();
  if (promptElement) promptElement.hidden = true;
  if (pauseButton) pauseButton.innerHTML = '<span aria-hidden="true">Ⅱ</span> Pause';
});

gameRoot?.addEventListener("cosmicrun:score", ({ detail }) => {
  currentScore = detail.score;
  if (scoreElement) scoreElement.textContent = formatScore(currentScore);
});

gameRoot?.addEventListener("cosmicrun:gameover", () => {
  gameState = saveGameState(recordScore(gameState, currentScore));
  renderPersistentState();
  if (promptElement) {
    promptElement.hidden = false;
    promptElement.textContent = "Signal lost — press R or tap the runner to relaunch";
  }
  if (announcementElement) announcementElement.textContent = `Game over. Score ${currentScore}. High score ${gameState.highScore}.`;
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
applySettings();
