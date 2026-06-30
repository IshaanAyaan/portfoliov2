import * as THREE from "./vendor/three-0.160.0/build/three.module.js";

const DESTINATION_ORDER = [
  "center",
  "education",
  "experience",
  "projects",
  "events",
  "papers",
  "distinctions",
  "now",
  "resume",
  "contact",
];

export const CITY_DISTRICTS = [
  {
    id: "center",
    label: "Ishaan Tower",
    sectionId: "about",
    type: "hub",
    position: { x: 0, y: 0, z: 0 },
    accent: "#8ee8ff",
    summary: "Applied AI builder, researcher, Luxen co-founder, and incoming Georgia Tech CS student.",
    links: [
      { label: "Full profile", href: "#about" },
      { label: "Resume", href: "Ishaan_Ranjan_Job_Resume.pdf" },
    ],
    items: ["Georgia Tech CS", "Luxen LLC", "Agent systems", "Policy and health research"],
    details: [
      {
        title: "Applied AI builder",
        meta: "Systems, agents, automation",
        body: "Building applied AI systems across developer tooling, policy, automation, and research.",
      },
      {
        title: "Luxen co-founder",
        meta: "Products and agent tooling",
        body: "Shipped AI products, scaled prototypes, and worked across product, engineering, and research.",
      },
      {
        title: "Georgia Tech CS",
        meta: "Incoming Fall 2026",
        body: "Computer science with threads in Intelligence and Theory.",
      },
    ],
  },
  {
    id: "education",
    label: "Campus District",
    sectionId: "education",
    type: "campus",
    position: { x: 0, y: 0, z: -48 },
    accent: "#78ffc8",
    summary: "Georgia Tech computer science, BASIS Peoria, and the academic foundation behind the work.",
    links: [{ label: "Open education", href: "#education" }],
    items: ["Georgia Tech CS", "Threads: Intelligence and Theory", "BASIS Peoria", "SAT 1540 / ACT 35"],
    details: [
      {
        title: "Georgia Institute of Technology",
        meta: "B.S. Computer Science · Incoming Fall 2026",
        body: "Expected graduation: December 2028. Threads: Intelligence and Theory.",
      },
      {
        title: "BASIS Peoria",
        meta: "GPA 3.99 UW / 4.87 W",
        body: "SAT 1540, ACT 35, BASIS Ventures Scholarship recipient, Research Club President, Debate Captain, and SciOly Engineering Lead.",
      },
    ],
  },
  {
    id: "experience",
    label: "Startup Skyline",
    sectionId: "experience",
    type: "skyline",
    position: { x: 50, y: 0, z: -24 },
    accent: "#ffb86b",
    summary: "Luxen, YC Startup School, and KEYS research work represented as a founder skyline.",
    links: [
      { label: "Experience", href: "#experience" },
      { label: "Luxen", href: "https://luxenai.org" },
    ],
    items: ["Luxen LLC", "YC Startup School 2026", "KEYS Research Intern", "5K+ users and 1.5M+ views"],
    details: [
      {
        title: "Y Combinator Startup School 2026",
        meta: "Incoming Founder · Summer 2026",
        body: "Selected for YC Startup School founder programming. Using customer discovery and rapid prototyping to test AI product strategy and go-to-market assumptions.",
      },
      {
        title: "Luxen LLC",
        meta: "Co-Founder",
        body: "Built and shipped AI products and agent tooling, took products from prototype to deployment, raised $48K+ in support and cloud credits, and scaled products to 5K+ active users and 1.5M+ media views.",
      },
      {
        title: "KEYS Research Intern",
        meta: "Precision Aging Network Lab · University of Arizona",
        body: "Analyzed vitamin D, omega-3, and exercise interventions in R and Python. Built reproducible notebooks and plots, then presented a poster talk to 800+ attendees.",
      },
    ],
  },
  {
    id: "projects",
    label: "Maker District",
    sectionId: "projects",
    type: "maker",
    position: { x: 46, y: 0, z: 34 },
    accent: "#ff6b5f",
    summary: "A neon build district for AI products, agent tooling, policy systems, and hackathon prototypes.",
    links: [{ label: "Projects", href: "#projects" }],
    items: ["PRISM", "AgentTree", "School Pulse AI", "YConstruction", "GreenhouseAgent", "Debatica", "SLM Subagents"],
    details: [
      {
        title: "PRISM",
        meta: "Policy AI benchmark",
        body: "Policy benchmark for classification, causal audit, and crash-risk forecasting.",
      },
      {
        title: "Specialized Small-Model Subagents",
        meta: "Fine-tuned coding specialists",
        body: "Small-model specialists and a custom harness for cost-efficient multi-agent coding workflows.",
      },
      {
        title: "AgentTree",
        meta: "Multi-agent coding workspace",
        body: "Workspace for multi-agent coding sessions and runtime control.",
      },
      {
        title: "School Pulse AI",
        meta: "Edge-AI operations suite",
        body: "School operations suite for leak detection, compost sorting, and resource forecasting in one dashboard.",
      },
      {
        title: "YConstruction",
        meta: "Voice-first iPhone app",
        body: "Construction defect reporting app with on-device AI, pitched at the YC x Google DeepMind hackathon.",
      },
      {
        title: "GreenhouseAgent",
        meta: "Automation + environment",
        body: "Agentic greenhouse monitoring and automation project.",
      },
      {
        title: "Debatica",
        meta: "Debate tooling",
        body: "Debate-oriented product work connected to research, speaking, and argument workflows.",
      },
    ],
  },
  {
    id: "events",
    label: "Founders Stadium",
    sectionId: "events",
    type: "stadium",
    position: { x: -8, y: 0, z: 54 },
    accent: "#ffd36b",
    summary: "Events, founder rooms, hackathons, and conferences collected in an arena district.",
    links: [{ label: "Events", href: "#events" }],
    items: ["MIT Blueprint", "YC x Google DeepMind", "High School Palantir Conference", "Startup School"],
    details: [
      {
        title: "Y Combinator Startup School 2026",
        meta: "Founder programming",
        body: "Selected for YC Startup School 2026 founder programming.",
      },
      {
        title: "MIT Blueprint",
        meta: "Builder event",
        body: "Participated in MIT Blueprint and connected startup work with fast technical prototyping.",
      },
      {
        title: "YC x Google DeepMind Gemma Voice Agents Hackathon",
        meta: "Voice agents and local AI",
        body: "Attended the hackathon, heard from a YC General Partner, and talked with founders/builders about on-device inference and developer ergonomics.",
      },
      {
        title: "High School Palantir Conference",
        meta: "Technology and policy",
        body: "Participated in a conference environment focused on technology, institutions, and applied work.",
      },
    ],
  },
  {
    id: "papers",
    label: "Research Observatory",
    sectionId: "papers",
    type: "observatory",
    position: { x: -46, y: 0, z: -26 },
    accent: "#a4b8ff",
    summary: "Papers and research live in an observatory/archive district with data terminals.",
    links: [
      { label: "Papers", href: "#papers" },
      { label: "KEYS abstract", href: "KEYS%20Abstract.pdf" },
    ],
    items: ["PRISM Alcohol Policy Impact Atlas", "Criminal Tribes Act", "SABER", "KEYS @ PAN"],
    details: [
      {
        title: "PRISM Alcohol Policy Impact Atlas",
        meta: "Policy benchmark",
        body: "Policy AI work around classification, causal audit, and crash-risk forecasting.",
      },
      {
        title: "Criminal Tribes Act and social exclusion",
        meta: "Public policy research",
        body: "Research examining social exclusion, historical policy, and institutional effects.",
      },
      {
        title: "SABER",
        meta: "Environmental engineering",
        body: "Science and engineering research recognized with an AZSEF Grand Award.",
      },
      {
        title: "KEYS @ Precision Aging Network",
        meta: "Health research",
        body: "Research internship work analyzing vitamin D, omega-3, and exercise interventions.",
      },
    ],
  },
  {
    id: "distinctions",
    label: "Awards Museum",
    sectionId: "distinctions",
    type: "museum",
    position: { x: -52, y: 0, z: 28 },
    accent: "#f7f0a2",
    summary: "A museum facade for grants, debate wins, scholarships, rankings, and science awards.",
    links: [{ label: "Distinctions", href: "#distinctions" }],
    items: ["1517 Fund Medici Grantee", "Z Fellows Finalist 2x", "Top 5 Nationally in BQ Debate", "AZSEF Grand Award"],
    details: [
      { title: "1517 Fund Medici Grantee", meta: "Grant", body: "Recognized with support for building and research work." },
      { title: "Over $48K in grants and credits", meta: "Support", body: "Raised meaningful support across grants and cloud credits." },
      { title: "BASIS Ventures Scholarship", meta: "$5,000 USD", body: "Scholarship recipient." },
      { title: "Z Fellows Finalist", meta: "2x", body: "Finalist twice." },
      { title: "Top 5 Nationally in BQ Debate", meta: "Debate", body: "National debate distinction." },
      { title: "Arizona State Champion", meta: "Speech and Debate", body: "State champion and NSDA Nationals qualifier." },
      { title: "SSRN paper ranked #1", meta: "Downloads", body: "Research paper ranked first in downloads." },
      { title: "AZSEF Grand Award", meta: "SABER", body: "Science and engineering fair recognition." },
    ],
  },
  {
    id: "now",
    label: "Now Radio",
    sectionId: "now",
    type: "radio",
    position: { x: 0, y: 0, z: 70 },
    accent: "#38e86f",
    summary: "A rooftop radio tower for music, reading, and current obsessions.",
    links: [{ label: "Now", href: "#now" }],
    items: ["Spotify snapshot", "Current book", "Recently played", "Top tracks and artists"],
    details: [
      { title: "Spotify snapshot", meta: "Now", body: "Recently played, top tracks, and top artists sync into the Now section." },
      { title: "Current book", meta: "Reading", body: "Current reading appears alongside the music snapshot." },
    ],
  },
  {
    id: "resume",
    label: "Resume Terminal",
    sectionId: "resume",
    type: "terminal",
    position: { x: 66, y: 0, z: 4 },
    accent: "#ffffff",
    summary: "A skyport terminal for the PDF resume and machine-readable profile.",
    links: [
      { label: "Resume PDF", href: "Ishaan_Ranjan_Job_Resume.pdf" },
      { label: "Profile markdown", href: "profile.md" },
    ],
    items: ["Current internship resume", "Machine-readable profile", "PDF download"],
    details: [
      { title: "Current internship resume", meta: "PDF", body: "Current resume in PDF format." },
      { title: "Machine-readable profile", meta: "Markdown", body: "Professional profile available as profile.md." },
    ],
  },
  {
    id: "contact",
    label: "Contact Skyport",
    sectionId: "contact",
    type: "skyport",
    position: { x: -66, y: 0, z: 4 },
    accent: "#8ee8ff",
    summary: "The landing dock for email, GitHub, LinkedIn, Luxen, Instagram, and X.",
    links: [
      { label: "Email", href: "mailto:ishaanranjan15@gmail.com" },
      { label: "Contact section", href: "#contact" },
    ],
    items: ["ishaanranjan15@gmail.com", "GitHub", "LinkedIn", "Luxen", "Instagram", "X"],
    details: [
      { title: "Email", meta: "Primary", body: "ishaanranjan15@gmail.com" },
      { title: "GitHub", meta: "Code", body: "github.com/ishaanayaan" },
      { title: "LinkedIn", meta: "Professional", body: "ishaan-ranjan-86a41a217" },
      { title: "Luxen", meta: "Company", body: "luxenai.org" },
      { title: "Instagram", meta: "Social", body: "@ish.ran15" },
      { title: "X", meta: "Social", body: "@ishaanranjan15" },
    ],
  },
];

const DISTRICT_BY_ID = new Map(CITY_DISTRICTS.map((district) => [district.id, district]));

function supportsWebGL(canvas) {
  try {
    return Boolean(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch (_) {
    return false;
  }
}

function makeColor(value) {
  return new THREE.Color(value);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function smoothstep(value) {
  return value * value * (3 - 2 * value);
}

function districtVector(id, height) {
  const district = DISTRICT_BY_ID.get(id) || DISTRICT_BY_ID.get("center");
  return new THREE.Vector3(district.position.x, height, district.position.z);
}

function routeIndex(id) {
  return Math.max(0, DESTINATION_ORDER.indexOf(id));
}

function routePoint(progress, height) {
  const maxProgress = DESTINATION_ORDER.length - 1;
  const clamped = clamp(progress, 0, maxProgress);
  const startIndex = Math.floor(clamped);
  const endIndex = Math.min(maxProgress, startIndex + 1);
  const local = smoothstep(clamped - startIndex);
  const start = districtVector(DESTINATION_ORDER[startIndex], height);
  const end = districtVector(DESTINATION_ORDER[endIndex], height);
  return start.lerp(end, local);
}

function routeTangent(progress) {
  const ahead = routePoint(progress + 0.025, 8);
  const behind = routePoint(progress - 0.025, 8);
  return ahead.sub(behind).normalize();
}

function directFlightPoint(flight, height, arcScale = 1) {
  const progress = smoothstep(clamp(flight.progress, 0, 1));
  const point = flight.start.clone().lerp(flight.end, progress);
  point.y = height + Math.sin(progress * Math.PI) * flight.arc * arcScale;
  return point;
}

function createRouteGuide() {
  const geometry = new THREE.BufferGeometry();
  const samples = [];
  const maxProgress = DESTINATION_ORDER.length - 1;

  for (let index = 0; index <= 180; index += 1) {
    const point = routePoint((index / 180) * maxProgress, 0.16);
    samples.push(point.x, point.y, point.z);
  }

  geometry.setAttribute("position", new THREE.Float32BufferAttribute(samples, 3));

  return new THREE.Line(
    geometry,
    new THREE.LineBasicMaterial({
      color: "#8ee8ff",
      transparent: true,
      opacity: 0.72,
    })
  );
}

function createRoadStrip(startId, endId) {
  const start = districtVector(startId, 0.08);
  const end = districtVector(endId, 0.08);
  const midpoint = start.clone().lerp(end, 0.5);
  const dx = end.x - start.x;
  const dz = end.z - start.z;
  const length = Math.sqrt(dx * dx + dz * dz);
  const road = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.08, length),
    new THREE.MeshBasicMaterial({
      color: "#14323d",
      transparent: true,
      opacity: 0.96,
    })
  );
  road.position.copy(midpoint);
  road.rotation.y = Math.atan2(dx, dz);
  return road;
}

function createRoadDetails(startId, endId) {
  const group = new THREE.Group();
  const start = districtVector(startId, 0.18);
  const end = districtVector(endId, 0.18);
  const direction = end.clone().sub(start);
  const length = direction.length();
  const angle = Math.atan2(direction.x, direction.z);
  const count = Math.max(4, Math.floor(length / 7));

  for (let index = 1; index < count; index += 1) {
    const t = index / count;
    const point = start.clone().lerp(end, t);
    const dash = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.08, 2.2),
      new THREE.MeshBasicMaterial({
        color: index % 2 === 0 ? "#8ee8ff" : "#ffb86b",
        transparent: true,
        opacity: 0.72,
      })
    );
    dash.position.copy(point);
    dash.rotation.y = angle;
    group.add(dash);
  }

  return group;
}

function createSkyDome() {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const size = 512;
  canvas.width = size;
  canvas.height = size;

  const gradient = context.createLinearGradient(0, 0, 0, size);
  gradient.addColorStop(0, "#071320");
  gradient.addColorStop(0.42, "#050b12");
  gradient.addColorStop(0.72, "#020509");
  gradient.addColorStop(1, "#0a1418");
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  context.globalAlpha = 0.58;
  for (let index = 0; index < 220; index += 1) {
    const x = (index * 83) % size;
    const y = (index * 47) % Math.round(size * 0.58);
    const radius = index % 13 === 0 ? 1.3 : 0.7;
    context.fillStyle = index % 9 === 0 ? "#ffdab4" : "#bdefff";
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  const glow = context.createRadialGradient(size * 0.52, size * 0.78, 12, size * 0.52, size * 0.78, size * 0.42);
  glow.addColorStop(0, "rgba(142, 232, 255, 0.34)");
  glow.addColorStop(0.44, "rgba(142, 232, 255, 0.12)");
  glow.addColorStop(1, "rgba(142, 232, 255, 0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(240, 36, 18),
    new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
      depthWrite: false,
    })
  );
  dome.position.y = 26;
  return dome;
}

function createStreetNetwork() {
  const group = new THREE.Group();
  const roadMaterial = new THREE.MeshBasicMaterial({
    color: "#0b222c",
    transparent: true,
    opacity: 0.76,
  });
  const shoulderMaterial = new THREE.MeshBasicMaterial({
    color: "#1b3943",
    transparent: true,
    opacity: 0.34,
  });
  const dashMaterial = new THREE.MeshBasicMaterial({
    color: "#8ee8ff",
    transparent: true,
    opacity: 0.42,
  });
  const avenueGeometry = new THREE.BoxGeometry(3.4, 0.05, 176);
  const crossGeometry = new THREE.BoxGeometry(176, 0.05, 3.4);
  const shoulderVGeometry = new THREE.BoxGeometry(0.08, 0.06, 176);
  const shoulderHGeometry = new THREE.BoxGeometry(176, 0.06, 0.08);
  const dashVGeometry = new THREE.BoxGeometry(0.16, 0.08, 1.45);
  const dashHGeometry = new THREE.BoxGeometry(1.45, 0.08, 0.16);

  for (let lane = -72; lane <= 72; lane += 18) {
    const vertical = new THREE.Mesh(avenueGeometry, roadMaterial);
    vertical.position.set(lane, 0.055, 0);
    group.add(vertical);

    const horizontal = new THREE.Mesh(crossGeometry, roadMaterial);
    horizontal.position.set(0, 0.052, lane);
    group.add(horizontal);

    [-1, 1].forEach((side) => {
      const edgeV = new THREE.Mesh(shoulderVGeometry, shoulderMaterial);
      edgeV.position.set(lane + side * 1.82, 0.088, 0);
      group.add(edgeV);

      const edgeH = new THREE.Mesh(shoulderHGeometry, shoulderMaterial);
      edgeH.position.set(0, 0.086, lane + side * 1.82);
      group.add(edgeH);
    });

    for (let index = -76; index <= 76; index += 12) {
      const dashV = new THREE.Mesh(dashVGeometry, dashMaterial);
      dashV.position.set(lane, 0.12, index);
      group.add(dashV);

      const dashH = new THREE.Mesh(dashHGeometry, dashMaterial);
      dashH.position.set(index, 0.12, lane);
      group.add(dashH);
    }
  }

  return group;
}

function createCityLightField(count) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const cyan = new THREE.Color("#8ee8ff");
  const amber = new THREE.Color("#ffb86b");
  const red = new THREE.Color("#ff6b5f");

  for (let index = 0; index < count; index += 1) {
    const x = -84 + ((index * 37) % 168);
    const z = -84 + ((index * 61) % 168);
    const color = index % 17 === 0 ? red : (index % 5 === 0 ? amber : cyan);
    positions[index * 3] = x;
    positions[index * 3 + 1] = 0.38 + (index % 4) * 0.04;
    positions[index * 3 + 2] = z;
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      size: 0.34,
      vertexColors: true,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
    })
  );
}

function createLabelTexture(title, subtitle, accent) {
  const canvas = document.createElement("canvas");
  const width = 512;
  const height = 192;
  const context = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;

  context.clearRect(0, 0, width, height);
  context.fillStyle = "rgba(3, 8, 14, 0.78)";
  context.fillRect(0, 0, width, height);
  context.strokeStyle = accent;
  context.lineWidth = 4;
  context.strokeRect(8, 8, width - 16, height - 16);
  context.fillStyle = accent;
  context.fillRect(26, 28, 72, 4);
  context.fillStyle = "#f7fbff";
  context.font = "700 38px Space Grotesk, Arial, sans-serif";
  context.fillText(title, 26, 92);
  context.fillStyle = "rgba(222, 236, 246, 0.82)";
  context.font = "500 21px IBM Plex Mono, monospace";
  context.fillText(subtitle, 26, 132);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

const FACADE_TEXTURES = new Map();

function createFacadeTexture(accent, columns, rows) {
  const safeColumns = Math.max(3, Math.round(columns));
  const safeRows = Math.max(4, Math.round(rows));
  const key = accent + ":" + safeColumns + ":" + safeRows;

  if (FACADE_TEXTURES.has(key)) {
    return FACADE_TEXTURES.get(key);
  }

  const canvas = document.createElement("canvas");
  const width = 512;
  const height = 1024;
  const context = canvas.getContext("2d");
  const cellWidth = width / safeColumns;
  const cellHeight = height / safeRows;

  canvas.width = width;
  canvas.height = height;
  context.clearRect(0, 0, width, height);

  const gradient = context.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "rgba(42, 73, 86, 0.62)");
  gradient.addColorStop(0.48, "rgba(10, 24, 34, 0.54)");
  gradient.addColorStop(1, "rgba(3, 10, 16, 0.78)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.globalAlpha = 0.28;
  context.strokeStyle = accent;
  context.lineWidth = 1;
  for (let column = 1; column < safeColumns; column += 1) {
    const x = Math.round(column * cellWidth) + 0.5;
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }
  for (let row = 1; row < safeRows; row += 1) {
    const y = Math.round(row * cellHeight) + 0.5;
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }

  context.globalAlpha = 1;
  context.shadowColor = accent;
  context.shadowBlur = 7;
  for (let row = 0; row < safeRows; row += 1) {
    for (let column = 0; column < safeColumns; column += 1) {
      const lit = (row * 11 + column * 7 + safeRows) % 6 !== 1;
      const hot = (row * 5 + column * 13 + safeColumns) % 17 === 0;
      const marginX = Math.max(3, cellWidth * 0.18);
      const marginY = Math.max(3, cellHeight * 0.24);
      context.globalAlpha = lit ? (hot ? 0.84 : 0.48) : 0.09;
      context.fillStyle = hot ? "#fff0c8" : accent;
      context.fillRect(
        column * cellWidth + marginX,
        row * cellHeight + marginY,
        cellWidth - marginX * 2,
        Math.max(2, cellHeight - marginY * 2)
      );
    }
  }
  context.shadowBlur = 0;

  context.globalAlpha = 0.2;
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, 3);
  context.fillRect(0, height - 3, width, 3);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.magFilter = THREE.NearestFilter;
  FACADE_TEXTURES.set(key, texture);
  return texture;
}

function createBuilding(width, height, depth, color, accent) {
  const group = new THREE.Group();
  const accentColor = makeColor(accent);
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.62,
      metalness: 0.18,
    })
  );
  body.position.y = height / 2;
  group.add(body);

  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(body.geometry),
    new THREE.LineBasicMaterial({
      color: accent,
      transparent: true,
      opacity: 0.28,
    })
  );
  edges.position.copy(body.position);
  group.add(edges);

  if (height > 5) {
    const columns = clamp(Math.floor(width * 2.8), 7, 24);
    const rows = clamp(Math.floor(height * 0.82), 9, 38);
    const facadeTexture = createFacadeTexture(accent, columns, rows);
    const facadeMaterial = new THREE.MeshBasicMaterial({
      map: facadeTexture,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const frontFacade = new THREE.Mesh(
      new THREE.PlaneGeometry(width * 0.84, height * 0.78),
      facadeMaterial
    );
    frontFacade.position.set(0, height * 0.54, depth / 2 + 0.035);
    group.add(frontFacade);

    const sideFacade = new THREE.Mesh(
      new THREE.PlaneGeometry(depth * 0.84, height * 0.78),
      facadeMaterial
    );
    sideFacade.position.set(width / 2 + 0.035, height * 0.54, 0);
    sideFacade.rotation.y = Math.PI / 2;
    group.add(sideFacade);

    const windowMaterial = new THREE.MeshBasicMaterial({
      color: accentColor,
      transparent: true,
      opacity: 0.22,
    });
    const trimMaterial = new THREE.MeshBasicMaterial({
      color: accentColor,
      transparent: true,
      opacity: 0.18,
    });
    const roofMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#101821"),
      roughness: 0.52,
      metalness: 0.3,
    });
    const levels = Math.min(6, Math.max(2, Math.floor(height / 5)));

    for (let level = 1; level <= levels; level += 1) {
      const y = (height / (levels + 1)) * level;
      const front = new THREE.Mesh(new THREE.BoxGeometry(width * 0.72, 0.045, 0.04), windowMaterial);
      front.position.set(0, y, depth / 2 + 0.026);
      group.add(front);

      const side = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.045, depth * 0.72), windowMaterial);
      side.position.set(width / 2 + 0.026, y, 0);
      group.add(side);
    }

    const roofCap = new THREE.Mesh(new THREE.BoxGeometry(width * 1.08, 0.2, depth * 1.08), trimMaterial);
    roofCap.position.y = height + 0.1;
    group.add(roofCap);

    const roofHouse = new THREE.Mesh(new THREE.BoxGeometry(width * 0.58, 0.5, depth * 0.58), roofMaterial);
    roofHouse.position.y = height + 0.36;
    group.add(roofHouse);

    const roofSignal = new THREE.Mesh(new THREE.BoxGeometry(width * 0.38, 0.045, depth * 0.38), trimMaterial);
    roofSignal.position.y = height + 0.64;
    group.add(roofSignal);

    const roofLine = new THREE.Mesh(new THREE.BoxGeometry(width * 0.74, 0.05, Math.max(0.08, depth * 0.08)), windowMaterial);
    roofLine.position.y = height + 0.68;
    roofLine.position.z = depth * 0.18;
    group.add(roofLine);

    const cornerHeight = height * 0.78;
    const cornerGeometry = new THREE.BoxGeometry(0.055, cornerHeight, 0.055);
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([x, z]) => {
      const rod = new THREE.Mesh(cornerGeometry, trimMaterial);
      rod.position.set(x * width * 0.5, height * 0.5, z * depth * 0.5);
      group.add(rod);
    });

    if (height > 16) {
      const antenna = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.055, Math.min(3.8, height * 0.16), 8),
        trimMaterial
      );
      antenna.position.y = height + 1.55;
      group.add(antenna);
    }
  }

  return group;
}

function createBillboard(title, subtitle, accent) {
  const texture = createLabelTexture(title, subtitle, accent);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(9.6, 3.6), material);
  mesh.position.y = 7;
  return mesh;
}

function createLandmark(district) {
  const accent = makeColor(district.accent);
  const group = new THREE.Group();
  group.position.set(district.position.x, 0, district.position.z);
  group.userData.destination = district.id;

  const baseColor = new THREE.Color("#18212b");
  const glassColor = new THREE.Color("#263849");

  if (district.type === "hub") {
    const tower = createBuilding(8, 34, 8, new THREE.Color("#202a35"), accent);
    group.add(tower);

    const portraitGeometry = new THREE.PlaneGeometry(7.2, 7.2);
    const portraitMaterial = new THREE.MeshBasicMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.92,
    });
    const portrait = new THREE.Mesh(portraitGeometry, portraitMaterial);
    portrait.position.set(0, 20, 4.12);
    group.add(portrait);

    new THREE.TextureLoader().load("pic.jpeg", (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      portrait.material.map = texture;
      portrait.material.needsUpdate = true;
    });

    const label = createBillboard("Ishaan Ranjan", "AI builder / researcher / founder", district.accent);
    label.position.set(0, 11, 4.35);
    group.add(label);
  } else if (district.type === "stadium") {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(8, 1.3, 12, 48),
      new THREE.MeshStandardMaterial({ color: baseColor, roughness: 0.5, metalness: 0.2 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 2;
    group.add(ring);
    group.add(createBuilding(4, 8, 4, glassColor, accent));
  } else if (district.type === "observatory") {
    group.add(createBuilding(8, 14, 8, baseColor, accent));
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(5.2, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: "#26364a", roughness: 0.44, metalness: 0.18 })
    );
    dome.position.y = 14;
    group.add(dome);
  } else if (district.type === "radio") {
    group.add(createBuilding(5, 18, 5, baseColor, accent));
    const mast = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.ConeGeometry(4, 22, 4)),
      new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.74 })
    );
    mast.position.y = 30;
    group.add(mast);
  } else if (district.type === "skyport" || district.type === "terminal") {
    group.add(createBuilding(14, 5, 10, baseColor, accent));
    const pad = new THREE.Mesh(
      new THREE.CylinderGeometry(9, 9, 0.35, 48),
      new THREE.MeshStandardMaterial({ color: "#111922", roughness: 0.52, metalness: 0.32 })
    );
    pad.position.set(0, 0.22, -1);
    group.add(pad);
  } else if (district.type === "museum") {
    group.add(createBuilding(16, 10, 7, baseColor, accent));
    for (let index = -2; index <= 2; index += 1) {
      const column = createBuilding(1, 12, 1, new THREE.Color("#303235"), accent);
      column.position.set(index * 3, 0, 4);
      group.add(column);
    }
  } else {
    group.add(createBuilding(8, 18, 8, baseColor, accent));
    group.add(createBuilding(5, 24, 5, glassColor, accent));
  }

  const label = createBillboard(district.label, district.type.toUpperCase(), district.accent);
  label.position.set(0, district.type === "hub" ? 29 : 17, 6.2);
  group.add(label);

  if (district.type !== "hub") {
    district.items.slice(0, 3).forEach((item, index) => {
      const sign = createBillboard(item, "BUILDING TERMINAL", district.accent);
      sign.scale.setScalar(0.42);
      sign.position.set((index - 1) * 4.2, 5.2 + index * 2.7, 6.4);
      group.add(sign);
    });
  }

  const light = new THREE.PointLight(accent, 1.8, 28, 2.2);
  light.position.set(0, 12, 0);
  group.add(light);

  return group;
}

function createCraft() {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(1.6, 2.5, 0.72, 32),
    new THREE.MeshStandardMaterial({ color: "#d9f7ff", roughness: 0.28, metalness: 0.65 })
  );
  body.rotation.x = Math.PI / 2;
  group.add(body);

  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: "#7feaff", roughness: 0.18, metalness: 0.25, transparent: true, opacity: 0.82 })
  );
  dome.position.y = 0.42;
  group.add(dome);

  const glow = new THREE.PointLight("#8ee8ff", 2.4, 18, 2);
  glow.position.y = -1.2;
  group.add(glow);

  return group;
}

function createContrailPool(count) {
  const positions = new Float32Array(count * 3);
  const lives = new Float32Array(count);
  const velocities = Array.from({ length: count }, () => new THREE.Vector3());

  for (let index = 0; index < count; index += 1) {
    positions[index * 3 + 1] = -999;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const points = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color: "#8ee8ff",
      size: 0.34,
      transparent: true,
      opacity: 0.58,
      depthWrite: false,
    })
  );

  return { points, positions, lives, velocities, cursor: 0 };
}

function createTrafficPool(count) {
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);
  const lanes = new Float32Array(count);

  for (let index = 0; index < count; index += 1) {
    lanes[index] = -58 + ((index * 17) % 116);
    speeds[index] = 0.9 + ((index * 13) % 9) * 0.08;
    positions[index * 3] = -68 + ((index * 19) % 136);
    positions[index * 3 + 1] = 2.2 + ((index * 7) % 8) * 0.18;
    positions[index * 3 + 2] = lanes[index];
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const points = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color: "#ffb86b",
      size: 0.22,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    })
  );

  return { points, positions, speeds, lanes };
}

function renderPanel(root, district) {
  const kicker = root.querySelector("[data-city-panel-kicker]");
  const title = root.querySelector("[data-city-panel-title]");
  const summary = root.querySelector("[data-city-panel-summary]");
  const items = root.querySelector("[data-city-panel-items]");
  const links = root.querySelector("[data-city-panel-links]");
  const dockKicker = root.querySelector("[data-city-dock-kicker]");
  const dockTitle = root.querySelector("[data-city-dock-title]");
  const status = root.querySelector("[data-city-status]");

  if (kicker) {
    kicker.textContent = district.type === "hub" ? "Center hub" : district.label;
  }
  if (dockKicker) {
    dockKicker.textContent = district.type === "hub" ? "Current district" : district.type;
  }
  if (title) {
    title.textContent = district.label;
  }
  if (dockTitle) {
    dockTitle.textContent = district.label;
  }
  if (summary) {
    summary.textContent = district.summary;
  }
  if (status) {
    status.textContent = district.label + " selected. Open the building terminal for details or choose another city destination.";
  }
  if (items) {
    const detailItems = district.details && district.details.length
      ? district.details
      : district.items.map((item) => ({ title: item, meta: district.label, body: "" }));
    items.innerHTML = detailItems.map((item) => (
      '<article class="city-world__terminal-item">' +
        "<h3>" + escapeHtml(item.title) + "</h3>" +
        (item.meta ? '<p class="city-world__terminal-meta">' + escapeHtml(item.meta) + "</p>" : "") +
        (item.body ? "<p>" + escapeHtml(item.body) + "</p>" : "") +
      "</article>"
    )).join("");
  }
  if (links) {
    links.innerHTML = district.links.map((link) => {
      const external = /^https?:|\.pdf$|\.md$/.test(link.href);
      return '<a href="' + escapeHtml(link.href) + '"' + (external ? ' target="_blank" rel="noopener"' : "") + ">" + escapeHtml(link.label) + "</a>";
    }).join("");
  }

  root.querySelectorAll("[data-city-destination]").forEach((button) => {
    button.setAttribute("aria-pressed", button.dataset.cityDestination === district.id ? "true" : "false");
  });
}

function initFallbackControls(root) {
  renderPanel(root, DISTRICT_BY_ID.get("center"));
  root.querySelectorAll("[data-city-destination]").forEach((button) => {
    button.addEventListener("click", () => {
      const district = DISTRICT_BY_ID.get(button.dataset.cityDestination) || DISTRICT_BY_ID.get("center");
      renderPanel(root, district);
      root.classList.add("city-world--terminal-open");
    });
  });
}

function setTerminalOpen(root, open) {
  root.classList.toggle("city-world--terminal-open", open);

  const panel = root.querySelector("[data-city-panel]");
  const toggle = root.querySelector("[data-city-terminal-toggle]");

  if (panel) {
    panel.setAttribute("aria-hidden", open ? "false" : "true");
  }
  if (toggle) {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }
}

function createCityScene(root, reducedMotionMedia) {
  const canvas = root.querySelector("[data-city-canvas]");
  const reducedMotion = () => Boolean(reducedMotionMedia && reducedMotionMedia.matches);

  if (!canvas || !supportsWebGL(canvas)) {
    root.classList.add("city-world--fallback");
    initFallbackControls(root);
    return null;
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#060b11");
  scene.fog = new THREE.Fog("#060b11", 58, 190);
  scene.add(createSkyDome());

  const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 500);
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));

  scene.add(new THREE.HemisphereLight("#d4f6ff", "#0a111a", 1.85));
  const sun = new THREE.DirectionalLight("#ffffff", 1.7);
  sun.position.set(-40, 58, 28);
  scene.add(sun);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(180, 180, 1, 1),
    new THREE.MeshStandardMaterial({ color: "#091119", roughness: 0.82, metalness: 0.06 })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  const grid = new THREE.GridHelper(180, 36, "#1b3540", "#10212a");
  grid.material.transparent = true;
  grid.material.opacity = 0.24;
  scene.add(grid);
  scene.add(createStreetNetwork());
  scene.add(createCityLightField(440));

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const clickableGroups = [];
  const billboardGroups = [];
  const landingPads = [];

  CITY_DISTRICTS.forEach((district) => {
    const group = createLandmark(district);
    scene.add(group);
    clickableGroups.push(group);
    group.traverse((child) => {
      child.userData.destination = district.id;
    });
  });

  const routeGuide = createRouteGuide();
  for (let index = 0; index < DESTINATION_ORDER.length - 1; index += 1) {
    scene.add(createRoadStrip(DESTINATION_ORDER[index], DESTINATION_ORDER[index + 1]));
    scene.add(createRoadDetails(DESTINATION_ORDER[index], DESTINATION_ORDER[index + 1]));
  }
  scene.add(routeGuide);

  DESTINATION_ORDER.forEach((id) => {
    const district = DISTRICT_BY_ID.get(id);
    const pad = new THREE.Mesh(
      new THREE.RingGeometry(5.8, 6.2, 48),
      new THREE.MeshBasicMaterial({
        color: district.accent,
        transparent: true,
        opacity: id === "center" ? 0.42 : 0.24,
        side: THREE.DoubleSide,
      })
    );
    pad.rotation.x = -Math.PI / 2;
    pad.position.set(district.position.x, 0.2, district.position.z);
    pad.userData.baseOpacity = id === "center" ? 0.42 : 0.24;
    pad.userData.destination = id;
    pad.userData.phase = routeIndex(id) * 0.72;
    landingPads.push(pad);
    scene.add(pad);
  });

  const districtRing = CITY_DISTRICTS.filter((district) => district.id !== "center");
  districtRing.forEach((district, index) => {
    const color = makeColor(district.accent);
    for (let offset = 0; offset < 16; offset += 1) {
      const size = 2 + ((index + offset) % 4);
      const height = 5 + ((index * 11 + offset * 7) % 22);
      const building = createBuilding(
        size,
        height,
        size * (0.8 + ((offset % 3) * 0.18)),
        new THREE.Color("#111923").lerp(color, 0.06),
        color
      );
      const angle = (offset / 7) * Math.PI * 2;
      const radius = 10 + ((offset * 3) % 10);
      building.position.set(
        district.position.x + Math.cos(angle) * radius,
        0,
        district.position.z + Math.sin(angle) * radius
      );
      scene.add(building);
    }
  });

  for (let index = 0; index < 136; index += 1) {
    const x = -86 + ((index * 31) % 172);
    const z = -84 + ((index * 47) % 168);
    const nearDistrict = CITY_DISTRICTS.some((district) => {
      const dx = district.position.x - x;
      const dz = district.position.z - z;
      return Math.sqrt(dx * dx + dz * dz) < 13;
    });

    if (nearDistrict) {
      continue;
    }

    const colorSeed = new THREE.Color("#0e1720").lerp(new THREE.Color("#263849"), ((index * 7) % 10) / 38);
    const accent = new THREE.Color(index % 5 === 0 ? "#ffb86b" : "#8ee8ff");
    const block = createBuilding(
      2 + ((index * 5) % 5),
      3.2 + ((index * 11) % 18),
      2 + ((index * 3) % 5),
      colorSeed,
      accent
    );
    block.position.set(x, 0, z);
    scene.add(block);
  }

  CITY_DISTRICTS.forEach((district) => {
    const marker = createBillboard(district.label, "DIRECT FLIGHT", district.accent);
    marker.scale.setScalar(district.id === "center" ? 0.72 : 0.58);
    marker.position.set(district.position.x, district.id === "center" ? 44 : 23, district.position.z + 8);
    marker.userData.destination = district.id;
    billboardGroups.push(marker);
    scene.add(marker);
  });

  const craft = createCraft();
  craft.position.copy(routePoint(0, 8));
  scene.add(craft);

  const contrail = createContrailPool(120);
  scene.add(contrail.points);

  const traffic = createTrafficPool(90);
  scene.add(traffic.points);

  const state = {
    activeId: "center",
    activeIndex: 0,
    routeProgress: 0,
    desiredProgress: 0,
    craftPosition: craft.position.clone(),
    craftVelocity: new THREE.Vector3(),
    cameraVelocity: new THREE.Vector3(),
    cameraPosition: new THREE.Vector3(0, 126, 8),
    mapYaw: 0.18,
    cameraHeight: 122,
    inspectProgress: 0,
    directFlight: null,
    dragging: false,
    dragStartX: 0,
    dragStartY: 0,
    visible: !document.hidden,
    raf: 0,
  };

  camera.position.copy(state.cameraPosition);
  renderPanel(root, DISTRICT_BY_ID.get("center"));

  function setActiveDistrict(id) {
    const district = DISTRICT_BY_ID.get(id) || DISTRICT_BY_ID.get("center");
    root.dataset.cityActive = district.id;

    if (state.activeId === district.id) {
      return;
    }

    state.activeId = district.id;
    state.activeIndex = routeIndex(district.id);
    renderPanel(root, district);
  }

  function syncActiveFromRoute() {
    const nearestIndex = clamp(Math.round(state.routeProgress), 0, DESTINATION_ORDER.length - 1);
    setActiveDistrict(DESTINATION_ORDER[nearestIndex]);
  }

  function setDestination(id, options) {
    const district = DISTRICT_BY_ID.get(id) || DISTRICT_BY_ID.get("center");
    const targetIndex = routeIndex(district.id);
    const direct = Boolean(options && options.direct);
    const shouldOpenTerminal = Boolean(options && options.openTerminal);

    state.desiredProgress = targetIndex;
    setActiveDistrict(district.id);

    if (reducedMotion() || (options && options.instant)) {
      state.directFlight = null;
      state.routeProgress = state.desiredProgress;
      state.craftPosition.copy(routePoint(state.routeProgress, 8));
      state.craftVelocity.set(0, 0, 0);
      craft.position.copy(state.craftPosition);
      setTerminalOpen(root, shouldOpenTerminal);
      updateCamera(1, true);
      renderer.render(scene, camera);
      return;
    }

    if (direct) {
      const start = state.craftPosition.clone();
      const end = districtVector(district.id, 8);
      const distance = start.distanceTo(end);
      state.directFlight = {
        start,
        end,
        progress: 0,
        elapsed: 0,
        duration: clamp(distance / 18, 1.35, 4.4),
        arc: clamp(distance * 0.18, 8, 20),
        targetId: district.id,
        targetIndex,
        openTerminal: shouldOpenTerminal,
      };
      state.craftVelocity.multiplyScalar(0.2);
      setTerminalOpen(root, false);
      return;
    }

    state.directFlight = null;
    setTerminalOpen(root, shouldOpenTerminal);
  }

  function emitContrail() {
    const index = contrail.cursor;
    contrail.cursor = (contrail.cursor + 1) % contrail.lives.length;
    contrail.lives[index] = 1;
    contrail.positions[index * 3] = craft.position.x;
    contrail.positions[index * 3 + 1] = craft.position.y - 0.35;
    contrail.positions[index * 3 + 2] = craft.position.z;
    contrail.velocities[index].set(
      (Math.random() - 0.5) * 0.18,
      -0.04 - Math.random() * 0.08,
      (Math.random() - 0.5) * 0.18
    );
  }

  function updateContrail(delta) {
    if (reducedMotion()) {
      return;
    }

    if (state.craftVelocity.lengthSq() > 1.2) {
      emitContrail();
      emitContrail();
    }

    for (let index = 0; index < contrail.lives.length; index += 1) {
      if (contrail.lives[index] <= 0) {
        contrail.positions[index * 3 + 1] = -999;
        continue;
      }
      contrail.lives[index] -= delta * 0.55;
      contrail.positions[index * 3] += contrail.velocities[index].x;
      contrail.positions[index * 3 + 1] += contrail.velocities[index].y;
      contrail.positions[index * 3 + 2] += contrail.velocities[index].z;
    }
    contrail.points.geometry.attributes.position.needsUpdate = true;
  }

  function updateTraffic(delta) {
    if (reducedMotion()) {
      return;
    }

    for (let index = 0; index < traffic.speeds.length; index += 1) {
      const positionIndex = index * 3;
      traffic.positions[positionIndex] += traffic.speeds[index] * delta * 8;
      if (traffic.positions[positionIndex] > 74) {
        traffic.positions[positionIndex] = -74;
      }
    }
    traffic.points.geometry.attributes.position.needsUpdate = true;
  }

  function updateLandingPads(time) {
    if (reducedMotion()) {
      return;
    }

    const seconds = time * 0.001;
    landingPads.forEach((pad) => {
      const pulse = (Math.sin(seconds * 2.1 + pad.userData.phase) + 1) * 0.5;
      const active = pad.userData.destination === state.activeId;
      const scale = active ? 1.05 + pulse * 0.06 : 1 + pulse * 0.025;
      pad.scale.set(scale, scale, scale);
      pad.material.opacity = pad.userData.baseOpacity + pulse * (active ? 0.18 : 0.075);
    });
  }

  function updateRoute(delta) {
    if (reducedMotion()) {
      state.directFlight = null;
      state.routeProgress = state.desiredProgress;
      syncActiveFromRoute();
      return;
    }

    if (state.directFlight) {
      state.directFlight.elapsed += delta;
      state.directFlight.progress = clamp(state.directFlight.elapsed / state.directFlight.duration, 0, 1);

      if (state.directFlight.progress >= 1) {
        const completedFlight = state.directFlight;
        state.routeProgress = completedFlight.targetIndex;
        state.desiredProgress = completedFlight.targetIndex;
        state.directFlight = null;
        state.craftPosition.copy(routePoint(state.routeProgress, 8));
        state.craftVelocity.set(0, 0, 0);
        craft.position.copy(state.craftPosition);
        setActiveDistrict(completedFlight.targetId);
        setTerminalOpen(root, completedFlight.openTerminal);
      }
      return;
    }

    const distance = state.desiredProgress - state.routeProgress;
    const ease = 1 - Math.exp(-1.72 * delta);
    state.routeProgress += distance * ease;
    state.routeProgress = clamp(state.routeProgress, 0, DESTINATION_ORDER.length - 1);

    if (Math.abs(distance) < 0.003) {
      state.routeProgress = state.desiredProgress;
    }

    syncActiveFromRoute();
  }

  function updateCraft(delta) {
    const target = state.directFlight
      ? directFlightPoint(state.directFlight, 8)
      : routePoint(state.routeProgress, 8);
    const toTarget = target.clone().sub(state.craftPosition);
    const distance = toTarget.length();

    if (reducedMotion()) {
      state.craftPosition.copy(target);
      craft.position.copy(state.craftPosition);
      return;
    }

    const desiredVelocity = toTarget.multiplyScalar(2.08);
    const steering = desiredVelocity.sub(state.craftVelocity).clampLength(0, 8.2 * delta);

    state.craftVelocity.add(steering);
    state.craftVelocity.multiplyScalar(Math.pow(0.07, delta));
    state.craftVelocity.clampLength(0, 9.6);
    state.craftPosition.addScaledVector(state.craftVelocity, delta);

    if (distance < 0.12) {
      state.craftPosition.lerp(target, 0.35);
    }

    craft.position.copy(state.craftPosition);

    const tangent = state.directFlight
      ? state.directFlight.end.clone().sub(state.directFlight.start).normalize()
      : routeTangent(state.routeProgress);
    if (tangent.lengthSq() > 0.01) {
      craft.lookAt(state.craftPosition.clone().add(tangent));
      craft.rotateX(Math.PI / 2);
    }
  }

  function updateCamera(delta, instant) {
    const inspectTarget = root.classList.contains("city-world--terminal-open") ? 1 : 0;
    const inspectEase = instant ? 1 : 1 - Math.exp(-2.2 * delta);
    state.inspectProgress += (inspectTarget - state.inspectProgress) * inspectEase;

    const mapFocus = state.directFlight
      ? directFlightPoint(state.directFlight, 0, 0)
      : routePoint(state.routeProgress, 0);
    const activeDistrict = DISTRICT_BY_ID.get(state.activeId) || DISTRICT_BY_ID.get("center");
    const districtFocus = new THREE.Vector3(activeDistrict.position.x, 10, activeDistrict.position.z);
    const focus = mapFocus.clone().lerp(districtFocus, state.inspectProgress);
    const angle = state.mapYaw + state.inspectProgress * 0.58;

    const mapDesired = new THREE.Vector3(
      mapFocus.x + Math.sin(state.mapYaw) * 7,
      state.cameraHeight,
      mapFocus.z + Math.cos(state.mapYaw) * 7
    );
    const inspectDesired = new THREE.Vector3(
      districtFocus.x + Math.sin(angle) * 24,
      26,
      districtFocus.z + Math.cos(angle) * 24
    );
    const desired = mapDesired.lerp(inspectDesired, state.inspectProgress);
    const lookY = THREE.MathUtils.lerp(0, 8, state.inspectProgress);

    if (instant) {
      state.cameraPosition.copy(desired);
      state.cameraVelocity.set(0, 0, 0);
    } else {
      const spring = desired.sub(state.cameraPosition).multiplyScalar(2.35 * delta);
      state.cameraVelocity.add(spring);
      state.cameraVelocity.multiplyScalar(Math.pow(0.08, delta));
      state.cameraPosition.addScaledVector(state.cameraVelocity, delta);
    }

    camera.position.copy(state.cameraPosition);
    camera.lookAt(focus.x, lookY, focus.z);
  }

  function resize() {
    const rect = root.getBoundingClientRect();
    const width = Math.max(320, rect.width);
    const height = Math.max(520, rect.height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setSize(width, height, false);
    renderer.render(scene, camera);
  }

  function pickDestination(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects([...clickableGroups, ...billboardGroups], true);
    const hit = intersects.find((entry) => entry.object.userData.destination);
    if (hit) {
      setDestination(hit.object.userData.destination, { direct: true, openTerminal: true });
    }
  }

  function stepDestination(direction) {
    const next = clamp(Math.round(state.desiredProgress) + direction, 0, DESTINATION_ORDER.length - 1);
    if (next !== Math.round(state.desiredProgress)) {
      setDestination(DESTINATION_ORDER[next], { direct: true, openTerminal: true });
      return true;
    }
    return false;
  }

  function animate(time) {
    state.raf = window.requestAnimationFrame(animate);
    if (!state.visible) {
      return;
    }

    const delta = Math.min(0.034, time ? (time - (animate.lastTime || time)) / 1000 : 0.016);
    animate.lastTime = time;

    billboardGroups.forEach((billboard) => billboard.lookAt(camera.position));
    updateRoute(delta);
    updateCraft(delta);
    updateContrail(delta);
    updateTraffic(delta);
    updateLandingPads(time);
    updateCamera(delta);
    renderer.render(scene, camera);
  }

  root.querySelectorAll("[data-city-destination]").forEach((button) => {
    button.addEventListener("click", () => {
      setDestination(button.dataset.cityDestination, { direct: true, openTerminal: true });
    });
  });

  const terminalToggle = root.querySelector("[data-city-terminal-toggle]");
  if (terminalToggle) {
    terminalToggle.addEventListener("click", () => {
      setTerminalOpen(root, !root.classList.contains("city-world--terminal-open"));
    });
  }

  const terminalClose = root.querySelector("[data-city-terminal-close]");
  if (terminalClose) {
    terminalClose.addEventListener("click", () => {
      setTerminalOpen(root, false);
    });
  }

  canvas.addEventListener("pointerdown", (event) => {
    state.dragging = true;
    state.dragStartX = event.clientX;
    state.dragStartY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!state.dragging || reducedMotion()) {
      return;
    }
    const dx = event.movementX || 0;
    state.mapYaw -= dx * 0.004;
  });

  canvas.addEventListener("pointerup", (event) => {
    state.dragging = false;
    const movement = Math.abs(event.clientX - state.dragStartX) + Math.abs(event.clientY - state.dragStartY);
    if (movement < 8) {
      pickDestination(event);
    }
  });

  root.addEventListener("wheel", (event) => {
    if (event.target.closest && event.target.closest("[data-city-panel]")) {
      return;
    }

    if (state.directFlight) {
      state.directFlight = null;
      state.desiredProgress = state.routeProgress;
      state.craftVelocity.set(0, 0, 0);
    }

    const maxProgress = DESTINATION_ORDER.length - 1;
    const nextProgress = clamp(state.desiredProgress + event.deltaY * 0.00056, 0, maxProgress);
    const movingInsideRoute = nextProgress !== state.desiredProgress;

    if (movingInsideRoute) {
      state.desiredProgress = nextProgress;
      setTerminalOpen(root, false);
      syncActiveFromRoute();
      event.preventDefault();
      return;
    }
  }, { passive: false });

  document.addEventListener("keydown", (event) => {
    const inWorld = root.getBoundingClientRect().bottom > 0 && root.getBoundingClientRect().top < window.innerHeight;
    if (!inWorld) {
      return;
    }
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      if (stepDestination(1)) {
        event.preventDefault();
      }
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      if (stepDestination(-1)) {
        event.preventDefault();
      }
    } else if (event.key === "Escape") {
      setDestination("center");
    }
  });

  document.addEventListener("visibilitychange", () => {
    state.visible = !document.hidden;
    if (state.visible) {
      animate.lastTime = performance.now();
    }
  });

  if (typeof reducedMotionMedia.addEventListener === "function") {
    reducedMotionMedia.addEventListener("change", () => {
      setDestination(state.activeId, { instant: true });
    });
  }

  window.addEventListener("resize", resize);
  resize();
  setDestination("center", { instant: true });
  state.raf = window.requestAnimationFrame(animate);

  return {
    destroy() {
      window.cancelAnimationFrame(state.raf);
      renderer.dispose();
    },
  };
}

export function initCityWorld(options) {
  const root = options && options.root;
  const reducedMotionMedia = options && options.reducedMotionMedia;

  if (!root) {
    return null;
  }

  try {
    return createCityScene(root, reducedMotionMedia || window.matchMedia("(prefers-reduced-motion: reduce)"));
  } catch (error) {
    root.classList.add("city-world--fallback");
    initFallbackControls(root);
    return null;
  }
}
