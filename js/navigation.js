/**
 * navigation.js — Stepper, progress bar, and step navigation.
 */
window.Nav = (function () {
  let current = "identity";

  const steps = () => window.Renderer.visibleSections();
  const indexOf = (id) => steps().findIndex((s) => s.id === id);
  const getCurrent = () => current;

  function buildStepper() {
    const wrap = document.getElementById("stepper");
    const list = steps();
    const curIdx = indexOf(current);
    wrap.innerHTML = list
      .map((s, i) => {
        const state = i < curIdx ? "done" : i === curIdx ? "active" : "todo";
        const idx = state === "done" ? '<i data-lucide="check"></i>' : i + 1;
        return `
        <button type="button" class="step-item ${state}" data-step-nav="${s.id}" data-testid="step-nav-${s.id}">
          <span class="step-index"><i data-lucide="${s.icon}"></i></span>
          <span class="step-meta"><span class="step-kicker">Langkah ${i + 1}</span><span class="step-name">${s.title}</span></span>
        </button>`;
      })
      .join("");
    if (window.lucide) window.lucide.createIcons();
  }

  function updateProgress() {
    const list = steps();
    const curIdx = Math.max(0, indexOf(current));
    const pct =
      list.length <= 1 ? 100 : Math.round((curIdx / (list.length - 1)) * 100);
    document.getElementById("progress-bar").style.width = pct + "%";
    document.getElementById("progress-text").textContent =
      `Langkah ${curIdx + 1} dari ${list.length}`;
    document.getElementById("progress-pct").textContent = pct + "%";
  }

  function updateNavButtons() {
    const i = indexOf(current);
    const prev = document.getElementById("btn-prev");
    const next = document.getElementById("btn-next");
    const submit = document.getElementById("btn-submit");
    prev.disabled = i <= 0;
    const isReview = current === "review";
    next.hidden = isReview;
    submit.hidden = !isReview;
  }

  function show(id) {
    if (!steps().some((s) => s.id === id)) id = steps()[0].id;
    current = id;
    document.querySelectorAll(".step-panel").forEach((p) => {
      p.hidden = p.dataset.step !== id;
    });
    if (id === "review") window.Renderer.renderReview();
    buildStepper();
    updateProgress();
    updateNavButtons();
    window.Storage.saveStep(id);
    const top = document.getElementById("form-top");
    if (top) top.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function next() {
    const list = steps();
    const i = indexOf(current);
    if (current !== "review") {
      const errs = window.Validation.validateSection(
        current,
        window.STATE.data,
      );
      if (Object.keys(errs).length) {
        window.App.showErrors(errs, current);
        return;
      }
    }
    if (i < list.length - 1) show(list[i + 1].id);
  }

  function prev() {
    const i = indexOf(current);
    if (i > 0) show(steps()[i - 1].id);
  }

  /** Called after conditional visibility changes. */
  function refresh() {
    const list = steps();

    // Tidak ada section yang visible
    if (!list.length) {
      console.error("Navigation.refresh(): no visible sections.");
      return;
    }

    // Jika current section sudah tidak visible,
    // pindahkan ke section pertama yang masih visible.
    if (!list.some((s) => s.id === current)) {
      show(list[0].id);
      return;
    }

    // Render ulang seluruh komponen navigation
    show(current);
  }

  return {
    show,
    next,
    prev,
    refresh,
    getCurrent,
    buildStepper,
    updateProgress,
  };
})();
