export const BIOMES = [
  { id: "near-orbit", label: "Near Orbit", minimumScore: 0 },
  { id: "debris-field", label: "Debris Field", minimumScore: 500 },
  { id: "deep-space", label: "Deep Space", minimumScore: 1000 }
];

export function getBiome(score) {
  const safeScore = Math.max(0, Number(score) || 0);
  return [...BIOMES].reverse().find(({ minimumScore }) => safeScore >= minimumScore) || BIOMES[0];
}
