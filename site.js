import {
  CLUSTER_IDS,
  createUniverseState,
  reduceUniverseState
} from "./universe-core.js";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const universe = document.querySelector(".universe");
const portfolio = document.querySelector(".portfolio");
const canvas = document.querySelector(".field-canvas");
const clusterMap = document.querySelector(".cluster-map");
const satelliteLayer = document.querySelector("[data-satellite-layer]");
const buttons = [...document.querySelectorAll(".cluster[data-cluster]")];
const panel = document.querySelector(".explore-panel");
const panelTitle = document.querySelector("[data-panel-title]");
const panelDescription = document.querySelector("[data-panel-description]");
const panelNodes = document.querySelector("[data-panel-nodes]");
const panelRoute = document.querySelector("[data-panel-route]");
const closer = document.querySelector(".panel-close");

const clusterSections = {
  build: "work",
  research: "research",
  ideas: "events",
  trajectory: "experience",
  now: "now"
};
const names = {
  build: "BUILD",
  research: "RESEARCH",
  ideas: "IDEAS",
  trajectory: "TRAJECTORY",
  now: "NOW"
};
const descriptions = {
  build: "Products, agents, and tools taken from strange idea to working system.",
  research: "Experiments across intelligence, policy, health, security, and complex systems.",
  ideas: "Debate, philosophy, explanation, and the questions behind the systems.",
  trajectory: "Where I have been, what I have learned, and where I am heading.",
  now: "What I am building, reading, testing, and thinking about today."
};

function extractContent() {
  const groups = Object.fromEntries(CLUSTER_IDS.map((id) => [id, []]));
  document.querySelectorAll("[data-item]").forEach((element, index) => {
    const cluster = element.dataset.cluster;
    if (!groups[cluster]) return;
    const title = element.querySelector("h3");
    const summary = element.querySelector(".project-summary") || element.querySelector("p:not(.meta):not(.project-index)");
    const titleText = title?.textContent.trim() || "Item";
    const key = titleText.toLowerCase().replace(/\b20\d{2}\b/g, "").replace(/[^a-z0-9]+/g, " ").trim();
    if (groups[cluster].some((item) => item.key === key)) return;
    groups[cluster].push({
      id: `item-${index}`,
      key,
      title: titleText,
      summary: summary?.textContent.trim() || "",
      source: element
    });
  });
  groups.now.push({
    id: "now-reading",
    title: "Currently reading",
    summary: document.querySelector("[data-now-book]")?.textContent.trim() || "Current reading and listening signals.",
    source: document.querySelector("#now")
  });
  return groups;
}

const content = extractContent();

function setInert(element, inert) {
  if (!element) return;
  element.inert = inert;
  if (inert) element.setAttribute("inert", "");
  else element.removeAttribute("inert");
}

function scrollTo(element, block = "start") {
  element?.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block });
}

function createPanelNode(item) {
  const node = document.createElement("button");
  node.type = "button";
  node.className = "panel-node";
  const copy = document.createElement("span");
  copy.className = "panel-node-copy";
  const title = document.createElement("strong");
  title.textContent = item.title;
  const summary = document.createElement("em");
  summary.textContent = item.summary || "Explore this signal in the portfolio.";
  const action = document.createElement("span");
  action.className = "panel-node-action";
  action.textContent = "View ↘";
  copy.append(title, summary);
  node.append(copy, action);
  node.addEventListener("click", () => {
    controller.setMode("portfolio", { hash: "#portfolio" });
    window.setTimeout(() => scrollTo(item.source, "center"), 50);
  });
  return node;
}

function createSatellite(item, index) {
  const satellite = document.createElement("button");
  satellite.type = "button";
  satellite.className = "project-satellite";
  satellite.style.setProperty("--satellite-index", index);
  satellite.setAttribute("aria-label", `${item.title}. Open in portfolio.`);
  const marker = document.createElement("i");
  marker.setAttribute("aria-hidden", "true");
  const label = document.createElement("span");
  label.textContent = item.title;
  satellite.append(marker, label);
  satellite.addEventListener("click", () => {
    controller.setMode("portfolio", { hash: "#portfolio" });
    window.setTimeout(() => scrollTo(item.source, "center"), 50);
  });
  return satellite;
}

function createUniverseController() {
  let state = createUniverseState(location.hash);
  let lastFocus = null;
  let field = null;

  function render(previous = state, options = {}) {
    const isPortfolio = state.mode === "portfolio";
    const isOpen = Boolean(state.selected);
    document.body.classList.toggle("is-portfolio", isPortfolio);
    universe?.classList.toggle("is-open", isOpen);
    universe?.toggleAttribute("data-selected", isOpen);
    if (universe) universe.dataset.selectedCluster = state.selected || "";

    document.querySelectorAll("[data-mode]").forEach((link) => {
      link.setAttribute("aria-current", String(link.dataset.mode === state.mode));
    });
    buttons.forEach((button) => {
      const active = button.dataset.cluster === state.selected;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-expanded", String(active));
    });

    if (panel) {
      panel.hidden = !isOpen;
      setInert(panel, !isOpen);
    }
    if (satelliteLayer) {
      satelliteLayer.hidden = !isOpen;
      setInert(satelliteLayer, !isOpen);
    }
    if (isOpen && state.selected !== previous.selected) {
      const id = state.selected;
      panelTitle.textContent = names[id];
      panelDescription.textContent = descriptions[id];
      panelNodes.replaceChildren(...content[id].slice(0, 5).map(createPanelNode));
      satelliteLayer?.replaceChildren(...content[id].slice(0, 5).map(createSatellite));
      panelRoute.href = `#${clusterSections[id]}`;
      panelRoute.dataset.target = clusterSections[id];
      if (options.moveFocus) panelTitle.focus({ preventScroll: true });
    }
    if (!isOpen && previous.selected && options.restoreFocus !== false) {
      lastFocus?.focus?.({ preventScroll: true });
    }
    if (state.paused) field?.pause();
    else field?.resume();
  }

  function dispatch(action, options = {}) {
    const previous = state;
    state = reduceUniverseState(state, action);
    render(previous, options);
    return state;
  }

  function select(id, options = {}) {
    if (!CLUSTER_IDS.includes(id)) return state;
    lastFocus = options.trigger || document.activeElement;
    dispatch({ type: "select", id }, options);
    if (options.writeHash !== false) history.pushState({}, "", `#cluster/${id}`);
    return state;
  }

  function clear(options = {}) {
    const next = dispatch({ type: "clear" }, options);
    if (options.writeHash !== false && location.hash.startsWith("#cluster/")) {
      history.pushState({}, "", "#explore");
    }
    return next;
  }

  function setMode(mode, options = {}) {
    clear({ writeHash: false, restoreFocus: false });
    dispatch({ type: "mode", mode }, options);
    if (options.hash) history.pushState({}, "", options.hash);
    return state;
  }

  function route(hash = location.hash) {
    const previous = state;
    state = reduceUniverseState(state, { type: "route", hash });
    render(previous, { moveFocus: false, restoreFocus: false });
  }

  function attachField(nextField) {
    field = nextField;
    render(state);
  }

  function pause() { dispatch({ type: "pause" }); }
  function resume() { dispatch({ type: "resume" }); }
  function destroy() {
    dispatch({ type: "destroy" });
    field?.destroy();
    field = null;
  }

  render({ ...state, selected: null }, { moveFocus: false, restoreFocus: false });
  return { select, clear, setMode, route, pause, resume, destroy, attachField, getState: () => ({ ...state }) };
}

const controller = createUniverseController();
window.__portfolioUniverse = controller;

buttons.forEach((button) => {
  button.addEventListener("click", () => controller.select(button.dataset.cluster, {
    trigger: button,
    moveFocus: true
  }));
});
closer?.addEventListener("click", () => controller.clear({ restoreFocus: true }));
universe?.addEventListener("click", (event) => {
  if (event.target === universe || event.target === canvas) controller.clear({ restoreFocus: true });
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && controller.getState().selected) controller.clear({ restoreFocus: true });
});
panelRoute?.addEventListener("click", (event) => {
  event.preventDefault();
  const target = document.getElementById(panelRoute.dataset.target);
  controller.setMode("portfolio", { hash: panelRoute.getAttribute("href") });
  scrollTo(target);
});
window.addEventListener("popstate", () => controller.route());
window.addEventListener("hashchange", () => controller.route());

document.querySelectorAll("[data-mode]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const mode = link.dataset.mode;
    controller.setMode(mode, { hash: mode === "portfolio" ? "#portfolio" : "#explore" });
    scrollTo(mode === "portfolio" ? portfolio : universe);
  });
});

document.querySelectorAll('a[href^="#"]:not([data-mode])').forEach((link) => {
  link.addEventListener("click", (event) => {
    const id = link.getAttribute("href").slice(1);
    if (!id || id.startsWith("cluster/")) return;
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    controller.setMode(id === "explore" ? "explore" : "portfolio", { hash: `#${id}` });
    scrollTo(target);
  });
});

function initNow() {
  const root = document.querySelector("[data-now-widget]");
  if (!root) return;
  const format = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.valueOf())
      ? "Current snapshot unavailable"
      : `Updated ${date.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}`;
  };
  const renderList = (element, items, type) => {
    if (!element) return;
    element.replaceChildren(...(items || []).slice(0, 5).map((item) => {
      const row = document.createElement("li");
      const label = item.name || (type === "artist" ? "Unknown artist" : "Unknown track");
      if (item.url) {
        const link = document.createElement("a");
        link.href = item.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = label;
        row.append(link);
      } else row.textContent = label;
      return row;
    }));
    if (!element.children.length) element.append(Object.assign(document.createElement("li"), { textContent: "No snapshot available yet." }));
  };
  fetch("data/now.json", { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error("Now snapshot unavailable");
      return response.json();
    })
    .then((data) => {
      const book = data.book || {};
      const track = data.spotify?.recentTracks?.[0];
      root.querySelector("[data-now-book]").textContent = `${book.title || "No current book set"}${book.author ? ` by ${book.author}` : ""}`;
      if (track) {
        root.querySelector("[data-now-track]").textContent = track.name || "Unknown track";
        root.querySelector("[data-now-artist]").textContent = track.artistNames?.join(", ") || "Unknown artist";
        if (track.url) root.querySelector("[data-now-link]").href = track.url;
      }
      renderList(root.querySelector("[data-now-top-tracks]"), data.spotify?.topTracks, "track");
      renderList(root.querySelector("[data-now-top-artists]"), data.spotify?.topArtists, "artist");
      root.querySelector("[data-now-updated]").textContent = format(data.updatedAt);
    })
    .catch(() => {
      root.querySelector("[data-now-updated]").textContent = "Spotify snapshot unavailable — showing the current book.";
    });
}

function createFieldController() {
  if (!canvas?.getContext) return { pause() {}, resume() {}, destroy() {} };
  const context = canvas.getContext("2d");
  let particles = [];
  let frame = 0;
  let running = false;
  let width = 0;
  let height = 0;

  function resize() {
    const rect = universe.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles = Array.from({ length: width < 700 ? 48 : 110 }, (_, index) => ({
      angle: Math.random() * Math.PI * 2,
      radius: 70 + Math.pow(Math.random(), 1.5) * Math.min(width * .43, 500),
      size: .35 + Math.random() * 1.5,
      speed: .000018 + (index % 7) * .000002,
      alpha: .12 + (index % 5) * .035
    }));
  }

  function draw(time = 0) {
    context.clearRect(0, 0, width, height);
    const centerX = width * .52;
    const centerY = height * .69;
    particles.forEach((particle) => {
      const angle = particle.angle + time * particle.speed;
      const x = centerX + Math.cos(angle) * particle.radius * 1.25;
      const y = centerY + Math.sin(angle) * particle.radius * .55;
      context.beginPath();
      context.arc(x, y, particle.size, 0, Math.PI * 2);
      context.fillStyle = `rgba(213, 224, 213, ${particle.alpha})`;
      context.fill();
    });
    if (running && !reduceMotion.matches) frame = requestAnimationFrame(draw);
  }

  const onResize = () => { resize(); draw(); };
  window.addEventListener("resize", onResize);
  resize();
  draw();
  return {
    pause() { running = false; cancelAnimationFrame(frame); },
    resume() {
      if (running) return;
      running = true;
      if (!reduceMotion.matches) frame = requestAnimationFrame(draw);
      else draw();
    },
    destroy() {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      context.clearRect(0, 0, width, height);
    }
  };
}

controller.attachField(createFieldController());

function updateTopbarContrast() {
  if (!portfolio) return;
  document.body.classList.toggle("is-over-portfolio", window.scrollY >= portfolio.offsetTop - 72);
}
window.addEventListener("scroll", updateTopbarContrast, { passive: true });
document.addEventListener("visibilitychange", () => document.hidden ? controller.pause() : controller.resume());
reduceMotion.addEventListener("change", () => controller.resume());
initNow();
updateTopbarContrast();
