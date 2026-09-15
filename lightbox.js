/*
  ==========================================================
  PROJECT IMAGE VIEWER

  Used only on the individual project pages.
  Any image inside <main> becomes clickable.

  Controls:
  - Click image: open viewer
  - Mouse wheel: zoom
  - Drag: move image
  - + / -: zoom
  - 0 or double click: reset
  - Esc: close
  ==========================================================
*/

(() => {
  const images = [...document.querySelectorAll("main img")];

  if (!images.length) return;


  /* -------------------------------------------------------
     Mark project images as clickable
     ------------------------------------------------------- */
  images.forEach((img) => {
    img.classList.add("zoomable");
    img.setAttribute("title", "Click to open image viewer");
  });


  /* -------------------------------------------------------
     Create the viewer once
     ------------------------------------------------------- */
  const viewer = document.createElement("div");

  viewer.className = "image-viewer";
  viewer.setAttribute("aria-hidden", "true");

  viewer.innerHTML = `
    <button
      class="image-viewer-close"
      type="button"
      aria-label="Close image viewer"
    >
      ×
    </button>

    <div class="image-viewer-toolbar">

      <button
        class="image-viewer-btn"
        type="button"
        data-action="zoom-out"
        aria-label="Zoom out"
      >
        −
      </button>

      <span class="image-viewer-zoom">100%</span>

      <button
        class="image-viewer-btn"
        type="button"
        data-action="zoom-in"
        aria-label="Zoom in"
      >
        +
      </button>

      <button
        class="image-viewer-btn"
        type="button"
        data-action="reset"
        aria-label="Reset zoom"
      >
        ↺
      </button>

    </div>

    <div class="image-viewer-stage">
      <img class="image-viewer-image" alt="">
    </div>

    <div class="image-viewer-hint">
      Mouse wheel: zoom · Drag: move · Double-click: reset · Esc: close
    </div>
  `;

  document.body.appendChild(viewer);


  /* -------------------------------------------------------
     Viewer elements
     ------------------------------------------------------- */
  const stage = viewer.querySelector(".image-viewer-stage");
  const viewerImage = viewer.querySelector(".image-viewer-image");
  viewerImage.draggable = false;
  viewerImage.addEventListener("dragstart", (event) => {
    event.preventDefault();
  });
  const zoomLabel = viewer.querySelector(".image-viewer-zoom");
  const closeButton = viewer.querySelector(".image-viewer-close");

  let scale = 1;
  let x = 0;
  let y = 0;

  let dragging = false;
  let startX = 0;
  let startY = 0;
  let startPanX = 0;
  let startPanY = 0;

  const MIN_SCALE = 0.5;
  const MAX_SCALE = 6;
  const STEP = 0.25;


  /* -------------------------------------------------------
     Viewer state
     ------------------------------------------------------- */
  function render() {
    viewerImage.style.transform =
      `translate(${x}px, ${y}px) scale(${scale})`;

    zoomLabel.textContent = `${Math.round(scale * 100)}%`;
  }

  function reset() {
    scale = 1;
    x = 0;
    y = 0;

    render();
  }

  function setScale(nextScale) {
    scale = Math.max(
      MIN_SCALE,
      Math.min(MAX_SCALE, nextScale)
    );

    render();
  }

  function openViewer(img) {
    viewerImage.src = img.currentSrc || img.src;
    viewerImage.alt = img.alt || "Project image";

    reset();

    viewer.classList.add("is-open");
    viewer.setAttribute("aria-hidden", "false");
    document.body.classList.add("viewer-open");
  }

  function closeViewer() {
    viewer.classList.remove("is-open");
    viewer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("viewer-open");

    dragging = false;
    stage.classList.remove("is-dragging");
  }


  /* -------------------------------------------------------
     Open / close
     ------------------------------------------------------- */
  images.forEach((img) => {
    img.addEventListener("click", () => openViewer(img));
  });

  closeButton.addEventListener("click", closeViewer);

  viewer.addEventListener("click", (event) => {
    if (event.target === viewer) {
      closeViewer();
    }
  });


  /* -------------------------------------------------------
     Toolbar controls
     ------------------------------------------------------- */
  viewer
    .querySelector('[data-action="zoom-in"]')
    .addEventListener("click", (event) => {
      event.stopPropagation();
      setScale(scale + STEP);
    });

  viewer
    .querySelector('[data-action="zoom-out"]')
    .addEventListener("click", (event) => {
      event.stopPropagation();
      setScale(scale - STEP);
    });

  viewer
    .querySelector('[data-action="reset"]')
    .addEventListener("click", (event) => {
      event.stopPropagation();
      reset();
    });


  /* -------------------------------------------------------
     Mouse wheel zoom
     ------------------------------------------------------- */
  stage.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();

      const direction = event.deltaY < 0 ? 1 : -1;
      setScale(scale + direction * STEP);
    },
    { passive: false }
  );


  /* -------------------------------------------------------
     Double-click reset
     ------------------------------------------------------- */
  stage.addEventListener("dblclick", (event) => {
    event.preventDefault();
    reset();
  });


  /* -------------------------------------------------------
     Drag / pan
     ------------------------------------------------------- */
  stage.addEventListener("pointerdown", (event) => {
    event.preventDefault();

    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    dragging = true;

    startX = event.clientX;
    startY = event.clientY;

    startPanX = x;
    startPanY = y;

    stage.classList.add("is-dragging");
    stage.setPointerCapture(event.pointerId);
  });

    dragging = true;

    startX = event.clientX;
    startY = event.clientY;

    startPanX = x;
    startPanY = y;

    stage.classList.add("is-dragging");
    stage.setPointerCapture(event.pointerId);
  });

  stage.addEventListener("pointermove", (event) => {
    if (!dragging) return;

    x = startPanX + (event.clientX - startX);
    y = startPanY + (event.clientY - startY);

    render();
  });

  function stopDragging(event) {
    if (!dragging) return;

    dragging = false;
    stage.classList.remove("is-dragging");

    try {
      stage.releasePointerCapture(event.pointerId);
    } catch (_) {
      /* Pointer may already be released. */
    }
  }

  stage.addEventListener("pointerup", stopDragging);
  stage.addEventListener("pointercancel", stopDragging);


  /* -------------------------------------------------------
     Keyboard controls
     ------------------------------------------------------- */
  document.addEventListener("keydown", (event) => {
    if (!viewer.classList.contains("is-open")) return;

    if (event.key === "Escape") closeViewer();
    if (event.key === "+" || event.key === "=") setScale(scale + STEP);
    if (event.key === "-") setScale(scale - STEP);
    if (event.key === "0") reset();
  });
})();
