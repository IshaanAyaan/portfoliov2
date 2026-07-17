import assert from "node:assert/strict";
import test from "node:test";
import {
  applyDistanceScore,
  collectSignal,
  createRunState,
  getBiome,
  missSignal
} from "../../game-mechanics.js";

test("distance score only moves forward", () => {
  const first = applyDistanceScore(createRunState(), 42.8);
  assert.equal(first.distanceScore, 42);
  assert.equal(applyDistanceScore(first, 12).distanceScore, 42);
});

test("signals award escalating bonuses capped at five times", () => {
  let run = createRunState();
  for (let index = 0; index < 6; index += 1) run = collectSignal(run);

  assert.equal(run.signals, 6);
  assert.equal(run.combo, 5);
  assert.equal(run.bonusScore, 2_000);
});

test("missing a signal resets the multiplier without losing score", () => {
  const run = missSignal(collectSignal(collectSignal(createRunState())));
  assert.equal(run.combo, 1);
  assert.equal(run.totalScore, 300);
});

test("biomes change at the intended score boundaries", () => {
  assert.equal(getBiome(499).id, "near-orbit");
  assert.equal(getBiome(500).id, "debris-field");
  assert.equal(getBiome(999).id, "debris-field");
  assert.equal(getBiome(1000).id, "deep-space");
});
