export const BIOMES = [
  { id: "near-orbit", label: "Near Orbit", minimumScore: 0 },
  { id: "debris-field", label: "Debris Field", minimumScore: 500 },
  { id: "deep-space", label: "Deep Space", minimumScore: 1000 }
];

export function getBiome(score) {
  const safeScore = Math.max(0, Number(score) || 0);
  return [...BIOMES].reverse().find(({ minimumScore }) => safeScore >= minimumScore) || BIOMES[0];
}

export function createRunState() {
  return { distanceScore: 0, bonusScore: 0, combo: 1, signals: 0, totalScore: 0 };
}

function total(run) {
  return { ...run, totalScore: run.distanceScore + run.bonusScore };
}

export function applyDistanceScore(run, distanceScore) {
  return total({ ...run, distanceScore: Math.max(run.distanceScore, Math.floor(Number(distanceScore) || 0)) });
}

export function collectSignal(run) {
  const combo = Math.min(5, run.combo);
  return total({
    ...run,
    bonusScore: run.bonusScore + 100 * combo,
    combo: Math.min(5, combo + 1),
    signals: run.signals + 1
  });
}

export function missSignal(run) {
  return { ...run, combo: 1 };
}
