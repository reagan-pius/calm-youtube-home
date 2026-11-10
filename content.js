console.log("[Calm YouTube Home] loaded");

const STYLE_ID = "calm-youtube-runtime";

const ROW_SELECTOR = `
  ytd-rich-item-renderer,
  ytd-video-renderer,
  ytd-grid-video-renderer
`;

/* rows past this index share a delay
   so later entries don't wait forever */
const MAX_STAGGER = 9;

function isHome() {
  return (
    location.pathname === "/" ||
    location.pathname === "/feed/explore"
  );
}

function injectRuntimeStyles() {
  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const style = document.createElement("style");

  style.id = STYLE_ID;

  style.textContent = `
    html.calm-youtube *:not(.calm-row, .calm-row *),
    html.calm-youtube *:not(.calm-row, .calm-row *)::before,
    html.calm-youtube *:not(.calm-row, .calm-row *)::after {
      animation:none !important;
      transition:none !important;
    }
  `;

  document.documentElement.appendChild(style);
}

function enableCalmMode() {
  if (!isHome()) {
    document.documentElement.classList.remove(
      "calm-youtube"
    );

    return;
  }

  document.documentElement.classList.add(
    "calm-youtube"
  );

  injectRuntimeStyles();

  removeVisualNoise();

  markRows();
}

function removeVisualNoise() {
  const shelves = document.querySelectorAll(`
      ytd-rich-shelf-renderer,
      ytd-reel-shelf-renderer
  `);

  shelves.forEach((el) => {
    el.remove();
  });

  document
    .querySelectorAll(
      `
      ytd-moving-thumbnail-renderer,
      ytd-video-preview,
      video
    `
    )
    .forEach((el) => {
      el.style.display = "none";
    });
}

function markRows() {
  document.querySelectorAll(ROW_SELECTOR).forEach(
    (row, index) => {
      if (row.classList.contains("calm-row")) {
        return;
      }

      row.classList.add("calm-row");

      row.style.setProperty(
        "--calm-i",
        Math.min(index, MAX_STAGGER)
      );
    }
  );
}

/* YouTube mutates the feed constantly;
   one frame of work per burst is plenty */
let scheduled = false;

function scheduleEnable() {
  if (scheduled) {
    return;
  }

  scheduled = true;

  requestAnimationFrame(() => {
    scheduled = false;

    enableCalmMode();
  });
}

const observer = new MutationObserver(scheduleEnable);

function start() {
  enableCalmMode();

  observer.observe(
    document.documentElement,
    {
      childList: true,
      subtree: true
    }
  );
}

window.addEventListener(
  "yt-navigate-finish",
  enableCalmMode
);

window.addEventListener(
  "load",
  start
);

start();
