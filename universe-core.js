export const CLUSTER_IDS = ["build", "research", "ideas", "trajectory", "now"];

export function parseUniverseHash(hash = "") {
  const value = hash || "#explore";
  if (value.startsWith("#cluster/")) {
    const selected = value.slice("#cluster/".length).split(/[/?&]/)[0];
    return {
      mode: "explore",
      selected: CLUSTER_IDS.includes(selected) ? selected : null
    };
  }
  return {
    mode: value === "#explore" || value === "#" ? "explore" : "portfolio",
    selected: null
  };
}

export function createUniverseState(hash = "#explore") {
  const route = parseUniverseHash(hash);
  return { ...route, paused: false, destroyed: false };
}

export function reduceUniverseState(state, action) {
  if (state.destroyed && action.type !== "destroy") return state;
  switch (action.type) {
    case "route":
      return { ...state, ...parseUniverseHash(action.hash) };
    case "select":
      return CLUSTER_IDS.includes(action.id)
        ? { ...state, mode: "explore", selected: action.id }
        : state;
    case "clear":
      return { ...state, selected: null };
    case "mode":
      return action.mode === "explore" || action.mode === "portfolio"
        ? { ...state, mode: action.mode, selected: action.mode === "portfolio" ? null : state.selected }
        : state;
    case "pause":
      return { ...state, paused: true };
    case "resume":
      return { ...state, paused: false };
    case "destroy":
      return { ...state, paused: true, destroyed: true };
    default:
      return state;
  }
}
