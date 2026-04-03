import { Runner } from "./resources/dino_game/offline.js";
import { spriteDefinitionByType } from "./resources/dino_game/offline-sprite-definitions.js";

Runner.config.CLEAR_TIME = 1200;
Runner.normalConfig.SPEED = 6.9;
Runner.normalConfig.ACCELERATION = 0.0019;
Runner.normalConfig.MAX_SPEED = 14.5;

const pterodactyl = spriteDefinitionByType.original.OBSTACLES.find(
  (obstacle) => obstacle.type === "PTERODACTYL"
);

if (pterodactyl) {
  pterodactyl.minSpeed = 7.1;
}

function initTrexRunner() {
  const container = document.querySelector(".trex-game");
  const resources = document.getElementById("offline-resources");

  if (!container || !resources || window.TrexRunner) {
    return;
  }

  window.TrexRunner = new Runner(container);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTrexRunner, { once: true });
} else {
  initTrexRunner();
}
