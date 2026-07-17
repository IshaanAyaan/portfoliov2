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
const formatScore = (score) => String(Math.max(0, Math.floor(score))).padStart(5, "0");

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

gameRoot?.addEventListener("cosmicrun:start", () => {
  currentScore = 0;
  gameState = saveGameState(recordRunStart(gameState));
  renderPersistentState();
});

gameRoot?.addEventListener("cosmicrun:score", ({ detail }) => {
  currentScore = detail.score;
  if (scoreElement) scoreElement.textContent = formatScore(currentScore);
});

gameRoot?.addEventListener("cosmicrun:gameover", () => {
  gameState = saveGameState(recordScore(gameState, currentScore));
  renderPersistentState();
});

renderPersistentState();
