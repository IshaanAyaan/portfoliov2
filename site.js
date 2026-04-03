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

  window.Portfolio = {
    init(options) {
      const settings = options || {};
      setTheme(loadTheme());
      initThemeButtons();
      initBackgrounds();

      if (settings.scrollSpy) {
        initScrollSpy();
      }
    },
  };
})();
