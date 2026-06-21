(function () {
  const root = document.documentElement;
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const backgrounds = [];

  function currentTheme() {
    return root.classList.contains("theme-light") ? "light" : "dark";
  }

  function setTheme(theme) {
    const nextTheme = theme === "light" ? "light" : "dark";
    root.classList.toggle("theme-light", nextTheme === "light");

    try {
      localStorage.setItem("portfolio-theme", nextTheme);
    } catch (_) {
    }

    if (themeMeta) {
      themeMeta.setAttribute("content", nextTheme === "light" ? "#f6f4ee" : "#05070b");
    }

    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.textContent = nextTheme === "light" ? "Dark" : "Light";
      button.setAttribute(
        "aria-label",
        nextTheme === "light" ? "Switch to dark theme" : "Switch to light theme"
      );
    });

    backgrounds.forEach((background) => background.refresh());
  }

  function loadTheme() {
    try {
      const saved = localStorage.getItem("portfolio-theme");
      return saved === "light" ? "light" : "dark";
    } catch (_) {
      return "dark";
    }
  }

  function themeColors() {
    if (currentTheme() === "light") {
      return {
        dot: "rgba(0, 0, 0, 0.38)",
        line: "rgba(0, 0, 0, 0.08)",
      };
    }

    return {
      dot: "rgba(255, 255, 255, 0.34)",
      line: "rgba(255, 255, 255, 0.10)",
    };
  }

  function createLuxenBackground(element) {
    const canvas = element.querySelector(".luxen-network__canvas");
    const context = canvas && canvas.getContext("2d");
    const baseSpeed = 0.3;
    const connectionDistance = 120;

    let animationFrame = 0;
    let particles = [];
    let width = 0;
    let height = 0;
    let reducedMotion = Boolean(prefersReducedMotion.matches);

    if (!canvas || !context) {
      return {
        refresh() {
        }
      };
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = width < 768 ? 30 : 60;
      const speed = currentTheme() === "light" ? baseSpeed : baseSpeed * 0.85;

      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (reducedMotion ? 0 : speed),
        vy: (Math.random() - 0.5) * (reducedMotion ? 0 : speed),
        size: Math.random() * 1.5 + 0.5,
      }));

      if (reducedMotion) {
        draw();
      }
    }

    function draw() {
      const colors = themeColors();
      context.clearRect(0, 0, width, height);

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];

        if (!reducedMotion) {
          particle.x += particle.vx;
          particle.y += particle.vy;

          if (particle.x < 0 || particle.x > width) {
            particle.vx *= -1;
          }

          if (particle.y < 0 || particle.y > height) {
            particle.vy *= -1;
          }
        }

        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fillStyle = colors.dot;
        context.fill();

        for (let inner = index + 1; inner < particles.length; inner += 1) {
          const peer = particles[inner];
          const dx = particle.x - peer.x;
          const dy = particle.y - peer.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            context.beginPath();
            context.strokeStyle = colors.line;
            context.lineWidth = 0.5;
            context.moveTo(particle.x, particle.y);
            context.lineTo(peer.x, peer.y);
            context.stroke();
          }
        }
      }
    }

    function tick() {
      draw();

      if (!reducedMotion) {
        animationFrame = window.requestAnimationFrame(tick);
      }
    }

    function refresh() {
      window.cancelAnimationFrame(animationFrame);
      draw();

      if (!reducedMotion) {
        animationFrame = window.requestAnimationFrame(tick);
      }
    }

    function updateMotionPreference() {
      reducedMotion = Boolean(prefersReducedMotion.matches);
      resize();
      refresh();
    }

    resize();
    refresh();

    window.addEventListener("resize", resize);

    if (typeof prefersReducedMotion.addEventListener === "function") {
      prefersReducedMotion.addEventListener("change", updateMotionPreference);
    } else if (typeof prefersReducedMotion.addListener === "function") {
      prefersReducedMotion.addListener(updateMotionPreference);
    }

    return { refresh };
  }

  function initThemeButtons() {
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        setTheme(currentTheme() === "light" ? "dark" : "light");
      });
    });
  }

  function initScrollSpy() {
    const links = Array.from(document.querySelectorAll(".site-nav a[data-section]"));
    if (!links.length) {
      return;
    }

    const sections = links
      .map((link) => document.getElementById(link.dataset.section))
      .filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((left, right) => left.target.offsetTop - right.target.offsetTop);

      if (!visible.length) {
        return;
      }

      const activeId = visible[0].target.id;
      links.forEach((link) => {
        link.setAttribute("aria-current", link.dataset.section === activeId ? "page" : "false");
      });
    }, { rootMargin: "-28% 0px -58% 0px", threshold: [0.1, 0.45, 0.7] });

    sections.forEach((section) => observer.observe(section));
  }

  function initBackgrounds() {
    document.querySelectorAll("[data-luxen-network]").forEach((element) => {
      backgrounds.push(createLuxenBackground(element));
    });
  }

  function initBlogToggle() {
    document.querySelectorAll("[data-blog-toggle]").forEach(function (card) {
      card.addEventListener("click", function (event) {
        if (event.target.closest("a")) {
          return;
        }
        var isExpanded = card.classList.toggle("is-expanded");
        card.setAttribute("aria-expanded", isExpanded ? "true" : "false");
      });
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function joinArtists(artists) {
    return Array.isArray(artists) ? artists.filter(Boolean).join(", ") : "";
  }

  function formatUpdatedAt(value) {
    if (!value) {
      return "Waiting for sync";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "Waiting for sync";
    }

    return "Updated " + date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }

  function renderRecentTracks(element, items) {
    if (!element) {
      return;
    }

    if (!Array.isArray(items) || !items.length) {
      element.innerHTML = "<li>No recent songs yet.</li>";
      return;
    }

    element.innerHTML = items.map(function (item) {
      const name = escapeHtml(item && item.name ? item.name : "Unknown track");
      const artists = escapeHtml(joinArtists(item && item.artistNames));
      const url = item && item.url;
      const title = url
        ? '<a class="now-link" href="' + escapeHtml(url) + '" target="_blank" rel="noopener">' + name + "</a>"
        : name;
      const subtitle = artists ? '<span class="now-subtle">' + artists + "</span>" : "";
      return "<li>" + title + subtitle + "</li>";
    }).join("");
  }

  function renderTopTracks(element, items) {
    if (!element) {
      return;
    }

    if (!Array.isArray(items) || !items.length) {
      element.innerHTML = "<li>No top tracks available yet.</li>";
      return;
    }

    element.innerHTML = items.map(function (item) {
      const name = escapeHtml(item && item.name ? item.name : "Unknown track");
      const artists = escapeHtml(joinArtists(item && item.artistNames));
      const url = item && item.url;
      const title = url
        ? '<a class="now-link" href="' + escapeHtml(url) + '" target="_blank" rel="noopener">' + name + "</a>"
        : name;
      const subtitle = artists ? '<span class="now-subtle">' + artists + "</span>" : "";
      return "<li>" + title + subtitle + "</li>";
    }).join("");
  }

  function renderTopArtists(element, items) {
    if (!element) {
      return;
    }

    if (!Array.isArray(items) || !items.length) {
      element.innerHTML = "<li>No top artists available yet.</li>";
      return;
    }

    element.innerHTML = items.map(function (item) {
      const name = escapeHtml(item && item.name ? item.name : "Unknown artist");
      const url = item && item.url;
      const title = url
        ? '<a class="now-link" href="' + escapeHtml(url) + '" target="_blank" rel="noopener">' + name + "</a>"
        : name;
      return "<li>" + title + "</li>";
    }).join("");
  }

  function renderNowWidget(payload) {
    const rootElement = document.querySelector("[data-now-widget]");
    if (!rootElement || !payload) {
      return;
    }

    const bookElement = rootElement.querySelector("[data-now-book]");
    const updatedElement = rootElement.querySelector("[data-now-updated]");
    const recentElement = rootElement.querySelector("[data-now-recent]");
    const topTracksElement = rootElement.querySelector("[data-now-top-tracks]");
    const topArtistsElement = rootElement.querySelector("[data-now-top-artists]");

    if (bookElement) {
      const book = payload.book || {};
      const title = book.title || "No current book set";
      const author = book.author ? " by " + book.author : "";
      bookElement.textContent = title + author;
    }

    if (updatedElement) {
      updatedElement.textContent = formatUpdatedAt(payload.updatedAt);
    }

    const spotify = payload.spotify || {};
    renderRecentTracks(recentElement, spotify.recentTracks);
    renderTopTracks(topTracksElement, spotify.topTracks);
    renderTopArtists(topArtistsElement, spotify.topArtists);
  }

  async function initNowWidget() {
    const rootElement = document.querySelector("[data-now-widget]");
    if (!rootElement) {
      return;
    }

    try {
      const response = await window.fetch("data/now.json?ts=" + Date.now(), {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load now.json (" + response.status + ")");
      }

      const payload = await response.json();
      renderNowWidget(payload);
    } catch (_) {
      renderNowWidget({
        updatedAt: null,
        book: {
          title: "Genghis Khan and the Making of the Modern World",
          author: "Jack Weatherford",
        },
        spotify: {
          recentTracks: [],
          topTracks: [],
          topArtists: [],
        },
      });
    }
  }

  window.Portfolio = {
    init(options) {
      const settings = options || {};
      setTheme(loadTheme());
      initThemeButtons();
      initBackgrounds();
      initBlogToggle();
      initNowWidget();

      if (settings.scrollSpy) {
        initScrollSpy();
      }
    },
  };
})();
