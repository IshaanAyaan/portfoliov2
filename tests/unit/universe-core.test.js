import assert from "node:assert/strict";
import test from "node:test";
import {
  createUniverseState,
  parseUniverseHash,
  reduceUniverseState
} from "../../universe-core.js";

test("hash parsing preserves valid cluster deep links", () => {
  assert.deepEqual(parseUniverseHash("#cluster/research"), { mode: "explore", selected: "research" });
  assert.deepEqual(parseUniverseHash("#cluster/unknown"), { mode: "explore", selected: null });
  assert.deepEqual(parseUniverseHash("#portfolio"), { mode: "portfolio", selected: null });
});

test("universe selection and clearing are deterministic", () => {
  let state = createUniverseState("#explore");
  state = reduceUniverseState(state, { type: "select", id: "build" });
  assert.equal(state.selected, "build");
  assert.equal(state.mode, "explore");
  state = reduceUniverseState(state, { type: "clear" });
  assert.equal(state.selected, null);
});

test("portfolio mode clears selection and teardown is final", () => {
  let state = reduceUniverseState(createUniverseState("#cluster/ideas"), { type: "mode", mode: "portfolio" });
  assert.equal(state.selected, null);
  state = reduceUniverseState(state, { type: "destroy" });
  assert.deepEqual(reduceUniverseState(state, { type: "resume" }), state);
});
