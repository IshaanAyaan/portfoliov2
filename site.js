(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var universe = document.querySelector(".universe");
  var portfolio = document.querySelector(".portfolio");
  var canvas = document.querySelector(".field-canvas");
  var buttons = Array.prototype.slice.call(document.querySelectorAll(".cluster[data-cluster]"));
  var panel = document.querySelector(".explore-panel");
  var panelTitle = document.querySelector("[data-panel-title]");
  var panelDescription = document.querySelector("[data-panel-description]");
  var panelNodes = document.querySelector("[data-panel-nodes]");
  var panelRoute = document.querySelector("[data-panel-route]");
  var closer = document.querySelector(".panel-close");
  var lastFocus = null;
  var lastCluster = null;
  var suppressClusterClick = false;
  var clusterSections = { build: "work", research: "research", ideas: "events", trajectory: "experience", now: "now" };
  var names = { build: "BUILD", research: "RESEARCH", ideas: "IDEAS", trajectory: "TRAJECTORY", now: "NOW" };
  var descriptions = {
    build: "Products, agents, and tools taken from strange idea to working system.",
    research: "Experiments across intelligence, policy, health, security, and complex systems.",
    ideas: "Debate, philosophy, explanation, and the questions behind the systems.",
    trajectory: "Where I have been, what I have learned, and where I am heading.",
    now: "What I am building, reading, testing, and thinking about today."
  };

  function extractContent() {
    var groups = { build: [], research: [], ideas: [], trajectory: [], now: [] };
    document.querySelectorAll("[data-item]").forEach(function (el, index) {
      var cluster = el.dataset.cluster;
      if (!groups[cluster]) return;
      var title = el.querySelector("h3");
      var summary = el.querySelector(".project-summary") || el.querySelector("p:not(.meta):not(.project-index)");
      var titleText = title ? title.textContent.trim() : "Item";
      var contentKey = titleText.toLowerCase().replace(/\b20\d{2}\b/g, "").replace(/[^a-z0-9]+/g, " ").trim();
      if (groups[cluster].some(function (item) { return item.key === contentKey; })) return;
      groups[cluster].push({ id: "item-" + index, key: contentKey, title: titleText, summary: summary ? summary.textContent.trim() : "", source: el });
    });
    var nowSource = document.querySelector("#now"), book = document.querySelector("[data-now-book]");
    groups.now.push({ id: "now-reading", title: "Currently reading", summary: book ? book.textContent.trim() : "Current reading and listening signals.", source: nowSource });
    return groups;
  }
  var content = extractContent();

  function modeFromHash() { var hash = location.hash || "#explore"; return hash === "#explore" || hash.indexOf("#cluster/") === 0 ? "explore" : "portfolio"; }
  function setMode(mode, shouldScroll) {
    var portfolioMode = mode === "portfolio";
    document.body.classList.toggle("is-portfolio", portfolioMode);
    document.querySelectorAll("[data-mode]").forEach(function (link) { link.setAttribute("aria-current", link.dataset.mode === mode ? "true" : "false"); });
    if (portfolioMode && shouldScroll) portfolio.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "start" });
  }
  function updateTopbarContrast() {
    if (!portfolio) return;
    document.body.classList.toggle("is-over-portfolio", window.scrollY >= portfolio.offsetTop - 72);
  }
  function parseHash() {
    var hash = location.hash || "#explore";
    if (hash.indexOf("#cluster/") === 0) { setMode("explore", false); openCluster(hash.split("/")[1], false); }
    else { closeCluster(false, false); setMode(modeFromHash(), false); }
  }
  function scrollToSource(source) {
    if (!source) return;
    setMode("portfolio", false);
    history.pushState({}, "", "#portfolio");
    window.setTimeout(function () { source.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "center" }); }, 50);
  }
  function openCluster(id, writeHash, trigger) {
    if (!content[id]) return;
    lastCluster = id;
    lastFocus = trigger || document.activeElement;
    universe.classList.add("is-open");
    buttons.forEach(function (button) { button.classList.toggle("is-active", button.dataset.cluster === id); button.setAttribute("aria-expanded", button.dataset.cluster === id ? "true" : "false"); });
    panelTitle.textContent = names[id]; panelDescription.textContent = descriptions[id]; panelNodes.innerHTML = "";
    content[id].slice(0, 5).forEach(function (item) {
      var node = document.createElement("button"); node.type = "button"; node.className = "panel-node";
      node.innerHTML = '<span class="panel-node-copy"><strong>' + escapeHTML(item.title) + "</strong><em>" + escapeHTML(item.summary || "Explore this signal in the portfolio.") + '</em></span><span class="panel-node-action">View ↘</span>';
      node.addEventListener("click", function () { scrollToSource(item.source); }); panelNodes.appendChild(node);
    });
    panelRoute.href = "#" + clusterSections[id]; panelRoute.onclick = function (event) { event.preventDefault(); var target = document.getElementById(clusterSections[id]); history.pushState({}, "", "#" + clusterSections[id]); setMode("portfolio", false); if (target) target.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "start" }); };
    if (writeHash) history.pushState({}, "", "#cluster/" + id);
  }
  function closeCluster(writeHash, restoreFocus) {
    universe.classList.remove("is-open");
    buttons.forEach(function (button) { button.classList.remove("is-active"); button.setAttribute("aria-expanded", "false"); });
    if (writeHash && location.hash.indexOf("#cluster/") === 0) history.pushState({}, "", "#explore");
    if (restoreFocus !== false && lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }
  function escapeHTML(value) { var div = document.createElement("div"); div.textContent = value; return div.innerHTML; }
  buttons.forEach(function (button) { button.setAttribute("aria-expanded", "false"); button.addEventListener("click", function (event) { if (suppressClusterClick) { event.preventDefault(); suppressClusterClick = false; return; } openCluster(button.dataset.cluster, true, button); }); });
  closer.addEventListener("click", function () { closeCluster(true); });
  universe.addEventListener("click", function (event) { if (event.target === universe || event.target === canvas) closeCluster(true); });
  document.addEventListener("keydown", function (event) { if (event.key === "Escape" && universe.classList.contains("is-open")) closeCluster(true); });
  window.addEventListener("popstate", parseHash); window.addEventListener("hashchange", parseHash);
  document.querySelectorAll("[data-mode]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      if (link.dataset.mode === "portfolio") {
        closeCluster(false, false); setMode("portfolio", false); history.pushState({}, "", "#portfolio");
        portfolio.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "start" });
      } else {
        setMode("explore", false);
        if (lastCluster) { history.pushState({}, "", "#cluster/" + lastCluster); openCluster(lastCluster, false); }
        else { closeCluster(false, false); history.pushState({}, "", "#explore"); }
        universe.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "start" });
      }
    });
  });

  function initInternalNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (event) {
        var id = link.getAttribute("href").slice(1);
        if (!id || id.indexOf("cluster/") === 0 || link.hasAttribute("data-mode")) return;
        var target = document.getElementById(id);
        if (!target) return;
        event.preventDefault();
        if (id === "explore") { closeCluster(false, false); setMode("explore", false); }
        else setMode("portfolio", false);
        history.pushState({}, "", "#" + id);
        target.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "start" });
      });
    });
  }

  function initNow() {
    var root = document.querySelector("[data-now-widget]"); if (!root) return;
    function format(value) { var date = new Date(value); return isNaN(date) ? "Current snapshot unavailable" : "Updated " + date.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }); }
    function renderList(element, items, type) {
      if (!element) return;
      element.textContent = "";
      (items || []).slice(0, 5).forEach(function (item) {
        var row = document.createElement("li"), link = document.createElement("a");
        link.textContent = type === "artist" ? (item.name || "Unknown artist") : (item.name || "Unknown track");
        if (item.url) { link.href = item.url; link.target = "_blank"; link.rel = "noopener"; row.appendChild(link); } else row.textContent = link.textContent;
        element.appendChild(row);
      });
      if (!element.children.length) element.innerHTML = "<li>No snapshot available yet.</li>";
    }
    fetch("data/now.json?ts=" + Date.now(), { cache: "no-store" }).then(function (response) { if (!response.ok) throw new Error(); return response.json(); }).then(function (data) {
      var book = data.book || {}, track = data.spotify && data.spotify.recentTracks && data.spotify.recentTracks[0];
      var bookEl = root.querySelector("[data-now-book]"), trackEl = root.querySelector("[data-now-track]"), artistEl = root.querySelector("[data-now-artist]"), linkEl = root.querySelector("[data-now-link]");
      if (bookEl) bookEl.textContent = (book.title || "No current book set") + (book.author ? " by " + book.author : "");
      if (track) { if (trackEl) trackEl.textContent = track.name || "Unknown track"; if (artistEl) artistEl.textContent = (track.artistNames || []).join(", ") || "Unknown artist"; if (linkEl && track.url) linkEl.href = track.url; }
      content.now = [{ id: "now-reading", title: "Reading · " + (book.title || "Current book"), summary: book.author ? "by " + book.author : "What I am reading now.", source: document.querySelector("#now") }];
      if (track) content.now.push({ id: "now-listening", title: "Listening · " + (track.name || "Recent track"), summary: (track.artistNames || []).join(", ") || "Recently played on Spotify.", source: document.querySelector("#now") });
      var topArtist = data.spotify && data.spotify.topArtists && data.spotify.topArtists[0];
      if (topArtist) content.now.push({ id: "now-artist", title: "Top artist · " + topArtist.name, summary: "Current short-term Spotify snapshot.", source: document.querySelector("#now") });
      renderList(root.querySelector("[data-now-top-tracks]"), data.spotify && data.spotify.topTracks, "track");
      renderList(root.querySelector("[data-now-top-artists]"), data.spotify && data.spotify.topArtists, "artist");
      root.querySelector("[data-now-updated]").textContent = format(data.updatedAt);
      if (lastCluster === "now" && universe.classList.contains("is-open")) openCluster("now", false, lastFocus);
    }).catch(function () { var status = root.querySelector("[data-now-updated]"); if (status) status.textContent = "Spotify snapshot unavailable — showing the current book."; });
  }

  function initField() {
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d"), particles = [], wisps = [], pointer = { x: -9999, y: -9999, vx: 0, vy: 0 }, width = 0, height = 0, frame, active = true;
    var clusterMap = document.querySelector(".cluster-map"), blackHole = document.querySelector(".black-hole"), dragging = false, moved = false, dragStartedOnCluster = false, dragPointerId = null, dragStartX = 0, dragStartY = 0, previousX = 0, previousY = 0, fieldRotation = 0, angularVelocity = 0;
    function resize() { var dpr = Math.min(devicePixelRatio || 1, innerWidth < 700 ? 1.25 : 1.5); width = innerWidth; height = innerHeight; canvas.width = width * dpr; canvas.height = height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); var count = innerWidth < 700 ? 48 : 112; particles = Array.from({ length: count }, function (_, index) { var clustered = index < count * .8, angle = Math.random() * Math.PI * 2, radius = 65 + Math.pow(Math.random(), 1.5) * Math.min(width * .37, 470), x = clustered ? width * .52 + Math.cos(angle) * radius * 1.32 : Math.random() * width, y = clustered ? height * .69 + Math.sin(angle) * radius * .58 : height * .35 + Math.random() * height * .65; return { x: x, y: y, ox: x, oy: y, phase: Math.random() * 6.28, size: Math.random() * 1.8 + .25, group: index % 3 }; }); wisps = Array.from({ length: innerWidth < 700 ? 4 : 8 }, function (_, index) { return { angle: index / (innerWidth < 700 ? 4 : 8) * Math.PI * 2 + Math.random() * .45, radius: 90 + Math.random() * Math.min(width * .2, 250), size: 68 + Math.random() * 82, speed: (index % 2 ? -1 : 1) * (.18 + Math.random() * .16), phase: Math.random() * Math.PI * 2, ox: 0, oy: 0, vx: 0, vy: 0, group: index % 3 }; }); }
    function drawWisps(time, cx, cy) {
      ctx.save(); ctx.globalCompositeOperation = "screen";
      wisps.forEach(function (w) {
        var orbit = w.angle + time * .00006 * w.speed + fieldRotation * Math.PI / 540;
        var baseX = cx + Math.cos(orbit) * w.radius * 1.45, baseY = cy + Math.sin(orbit) * w.radius * .62;
        var pd = Math.hypot(baseX + w.ox - pointer.x, baseY + w.oy - pointer.y), influence = Math.max(0, 1 - pd / 340);
        if (!reduceMotion.matches && influence > 0) { w.vx += pointer.vx * influence * (dragging ? .018 : .004); w.vy += pointer.vy * influence * (dragging ? .018 : .004); w.vx += -(baseY + w.oy - pointer.y) * influence * angularVelocity * .0004; w.vy += (baseX + w.ox - pointer.x) * influence * angularVelocity * .0004; }
        w.ox += w.vx; w.oy += w.vy; w.vx *= .92; w.vy *= .92; w.ox *= .992; w.oy *= .992;
        var x = baseX + w.ox, y = baseY + w.oy, pulse = 1 + Math.sin(time * .0007 + w.phase) * .1, size = w.size * pulse;
        var colors = w.group === 0 ? [205,218,200] : w.group === 1 ? [188,207,218] : [227,211,201];
        ctx.save(); ctx.translate(x, y); ctx.rotate(orbit * .45); ctx.scale(1.75 + Math.sin(w.phase + time * .0004) * .22, .5 + Math.cos(w.phase + time * .0005) * .08);
        var gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size); gradient.addColorStop(0, "rgba(" + colors.join(",") + ",.17)"); gradient.addColorStop(.42, "rgba(" + colors.join(",") + ",.08)"); gradient.addColorStop(1, "rgba(" + colors.join(",") + ",0)");
        ctx.fillStyle = gradient; ctx.beginPath(); ctx.arc(0, 0, size, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      });
      ctx.restore();
    }
    function applyFieldRotation() { if (!clusterMap) return; clusterMap.style.setProperty("--field-rotation", fieldRotation.toFixed(3) + "deg"); clusterMap.style.setProperty("--counter-rotation", (-fieldRotation).toFixed(3) + "deg"); }
    function draw(time) { if (!active) return; ctx.clearRect(0, 0, width, height); var cx = width * .52, cy = height * .69, t = time * .0002;
      if (!dragging && Math.abs(angularVelocity) > .001) { fieldRotation += angularVelocity; angularVelocity *= .955; }
      else if (!dragging) { fieldRotation += .005; }
      applyFieldRotation();
      if (blackHole) { var parallaxX = pointer.x < -1000 ? 0 : (pointer.x / width - .5) * 9, parallaxY = pointer.y < -1000 ? 0 : (pointer.y / height - .5) * 7; blackHole.style.setProperty("--hole-x", parallaxX.toFixed(2) + "px"); blackHole.style.setProperty("--hole-y", parallaxY.toFixed(2) + "px"); blackHole.style.setProperty("--hole-rotation", (fieldRotation * .32).toFixed(2) + "deg"); }
      drawWisps(time, cx, cy);
      particles.forEach(function (p, i) { var dx = p.x - cx, dy = p.y - cy, distance = Math.hypot(dx, dy) || 1, a = Math.atan2(dy, dx) + .0035 + Math.sin(t + p.phase) * .001; var pull = Math.max(.2, Math.min(1.2, distance / 420)); p.x = cx + Math.cos(a) * distance * (1 - .0006 * pull); p.y = cy + Math.sin(a) * distance * (1 - .0006 * pull); var px = p.x - pointer.x, py = p.y - pointer.y, pd = Math.hypot(px, py); if (!reduceMotion.matches && pd < 170) { p.x += (px / Math.max(pd, 1)) * (170 - pd) * .009; p.y += (py / Math.max(pd, 1)) * (170 - pd) * .009; }
        if (!reduceMotion.matches && pd < 300 && (dragging || Math.abs(angularVelocity) > .03)) { var flow = (1 - pd / 300); p.x += pointer.vx * flow * .11 - (py / Math.max(pd, 1)) * angularVelocity * flow * .35; p.y += pointer.vy * flow * .11 + (px / Math.max(pd, 1)) * angularVelocity * flow * .35; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fillStyle = p.group === 0 ? "rgba(205,218,197," + (.17 + (i % 4) * .04) + ")" : p.group === 1 ? "rgba(191,207,216," + (.15 + (i % 4) * .04) + ")" : "rgba(235,224,207," + (.13 + (i % 4) * .04) + ")"; ctx.fill();
        if (i % 4 === 0) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(cx + dx * .86, cy + dy * .86); ctx.strokeStyle = "rgba(205,217,202,.055)"; ctx.lineWidth = .5; ctx.stroke(); }
      });
      if (!reduceMotion.matches) frame = requestAnimationFrame(draw);
    }
    addEventListener("pointermove", function (event) {
      pointer.vx = pointer.x < -1000 ? 0 : event.clientX - pointer.x; pointer.vy = pointer.y < -1000 ? 0 : event.clientY - pointer.y; pointer.x = event.clientX; pointer.y = event.clientY;
      if (dragging) { var dx = event.clientX - previousX, dy = event.clientY - previousY; if (Math.hypot(event.clientX - dragStartX, event.clientY - dragStartY) > 5) { moved = true; if (clusterMap && dragPointerId !== null && !clusterMap.hasPointerCapture(dragPointerId)) { try { clusterMap.setPointerCapture(dragPointerId); } catch (_) {} } } angularVelocity = (dx + dy * .25) * .008; fieldRotation += angularVelocity; previousX = event.clientX; previousY = event.clientY; applyFieldRotation(); }
    }, { passive: true });
    if (clusterMap) {
      clusterMap.addEventListener("pointerdown", function (event) { if (reduceMotion.matches || event.button > 0) return; dragging = true; moved = false; dragPointerId = event.pointerId; dragStartedOnCluster = Boolean(event.target.closest(".cluster")); dragStartX = previousX = pointer.x = event.clientX; dragStartY = previousY = pointer.y = event.clientY; clusterMap.classList.add("is-dragging"); });
      var finishDrag = function (event) { if (!dragging) return; dragging = false; suppressClusterClick = moved && dragStartedOnCluster; if (suppressClusterClick) setTimeout(function () { suppressClusterClick = false; }, 0); clusterMap.classList.remove("is-dragging"); if (dragPointerId !== null && clusterMap.hasPointerCapture(dragPointerId)) clusterMap.releasePointerCapture(dragPointerId); dragPointerId = null; };
      addEventListener("pointerup", finishDrag);
      addEventListener("pointercancel", finishDrag);
    }
    addEventListener("resize", function () { resize(); if (reduceMotion.matches) draw(0); }); document.addEventListener("visibilitychange", function () { active = !document.hidden; if (active && !reduceMotion.matches) frame = requestAnimationFrame(draw); });
    reduceMotion.addEventListener("change", function () { cancelAnimationFrame(frame); if (reduceMotion.matches) draw(0); else frame = requestAnimationFrame(draw); }); resize(); draw(0);
  }
  addEventListener("scroll", updateTopbarContrast, { passive: true });
  initInternalNavigation(); initNow(); initField(); parseHash(); updateTopbarContrast();
}());
