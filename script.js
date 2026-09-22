// GITHUB GRAPH & CONTRIBUTIONS
const USERNAME = "selwynborja";

  const PITCH = 12;                          // spacing between dots
  const RADIUS  = [0.9, 2.2, 3.4, 4.5, 5.5]; // dot size per contribution level (0-4)
  const OPACITY = [0.25, 0.55, 0.75, 0.9, 1];

  async function renderContributions() {
    const graph = document.getElementById("contrib-graph");
    const total = document.getElementById("contrib-total");

    try {
      const res = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`
      );
      if (!res.ok) throw new Error("Request failed: " + res.status);
      const data = await res.json();

      const days = data.contributions;                                  // oldest -> newest
      const offset = new Date(days[0].date + "T00:00:00Z").getUTCDay(); // 0 = Sunday
      const cols = Math.ceil((offset + days.length) / 7);
      graph.setAttribute("viewBox", `0 0 ${cols * PITCH} ${7 * PITCH}`);

      const NS = "http://www.w3.org/2000/svg";
      days.forEach((day, i) => {
        const slot = i + offset;
        const level = RADIUS[day.level] !== undefined ? day.level : 0;

        const dot = document.createElementNS(NS, "circle");
        dot.setAttribute("cx", Math.floor(slot / 7) * PITCH + PITCH / 2);
        dot.setAttribute("cy", (slot % 7) * PITCH + PITCH / 2);
        dot.setAttribute("r", RADIUS[level]);
        dot.setAttribute("fill-opacity", OPACITY[level]);

        const tip = document.createElementNS(NS, "title");
        tip.textContent = `${day.count} contributions on ${day.date}`;
        dot.appendChild(tip);

        graph.appendChild(dot);
      });

      // On narrow screens the graph scrolls sideways: start at the most recent weeks
      const scroller = graph.parentElement;
      scroller.scrollLeft = scroller.scrollWidth;

      total.textContent =
        `${data.total.lastYear.toLocaleString()} contributions in the last year`;
    } catch (err) {
      total.textContent = "Couldn't load contributions. Check the username and try again.";
    }
  }

    renderContributions();


    // HAMBURGER MENU
    (() => {
      const nav = document.querySelector("nav");
      const toggle = nav.querySelector(".menu-toggle");
      const links = document.getElementById("nav-links");

      function setMenu(open) {
        nav.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", String(open));
      }

      toggle.addEventListener("click", () => {
        setMenu(toggle.getAttribute("aria-expanded") !== "true");
      });

      // close after picking a link, tapping outside, or pressing Escape
      links.addEventListener("click", (e) => {
        if (e.target.closest("a")) setMenu(false);
      });
      document.addEventListener("click", (e) => {
        if (!nav.contains(e.target)) setMenu(false);
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && nav.classList.contains("open")) {
          setMenu(false);
          toggle.focus();
        }
      });

      // switching back to the desktop layout resets the menu
      window.matchMedia("(min-width: 901px)").addEventListener("change", () => setMenu(false));
    })();



    // THEME
     (() => {
  const buttons = document.querySelectorAll(".theme-btn");

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    buttons.forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.themeChoice === theme));
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => applyTheme(btn.dataset.themeChoice));
  });

  // sync button states with whatever theme is already active on page load
  applyTheme(document.documentElement.dataset.theme || "dark");
})();