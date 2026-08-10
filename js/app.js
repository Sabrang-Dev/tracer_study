/**
 * app.js — Application bootstrap, event wiring, autosave, submit.
 */
window.STATE = { data: {} };

window.App = (function () {
  const SCHEMA = window.FORM_SCHEMA;

  /* ---------- selected-state styling sync ---------- */
  function syncSelected(name) {
    document
      .querySelectorAll(`input[name="${CSS.escape(name)}"]`)
      .forEach((inp) => {
        const card = inp.closest(".opt-card, .likert-pill, .scale-pill");
        if (card) card.classList.toggle("is-selected", inp.checked);
      });
  }

  /* ---------- error helpers ---------- */
  function clearError(id) {
    const wrap = document.querySelector(`.field-wrap[data-field-id="${id}"]`);
    const err = document.querySelector(`.field-error[data-error-for="${id}"]`);
    if (wrap) wrap.classList.remove("is-invalid");
    if (err) {
      err.textContent = "";
      err.hidden = true;
    }
  }

  function showErrors(errors, sectionId) {
    const section = SCHEMA.sections.find((s) => s.id === sectionId);
    if (section) section.fields.forEach((f) => clearError(f.id));
    let first = null;
    Object.entries(errors).forEach(([id, msg]) => {
      const wrap = document.querySelector(`.field-wrap[data-field-id="${id}"]`);
      const err = document.querySelector(
        `.field-error[data-error-for="${id}"]`,
      );
      if (wrap) wrap.classList.add("is-invalid");
      if (err) {
        err.textContent = msg;
        err.hidden = false;
      }
      if (!first) first = wrap;
    });
    if (first) {
      // first.scrollIntoView({ behavior: "smooth", block: "center" });
      window.Swal.fire({
        icon: "error",
        title: "Periksa kembali",
        text: "Beberapa isian wajib belum lengkap.",
        confirmButtonColor: "#0F4C81",
      });
    }
  }

  /* ---------- change handling ---------- */
  function onFieldChange(e) {
    const t = e.target;
    if (!t.name) return;
    const name = t.name;

    if (name.startsWith("q13__")) {
      const code = name.slice(5);
      window.STATE.data.q13 = window.STATE.data.q13 || {};
      window.STATE.data.q13[code] = t.value;
      syncSelected(name);
      clearError("q13");
    } else {
      const field = SCHEMA.allFields.find((f) => f.id === name);
      if (!field) return;
      if (field.type === "checkbox") {
        const checked = Array.from(
          document.querySelectorAll(
            `input[name="${CSS.escape(name)}"]:checked`,
          ),
        ).map((x) => x.value);
        window.STATE.data[name] = checked;
        syncSelected(name);
      } else if (field.type === "radio" || field.type === "likert") {
        window.STATE.data[name] = t.value;
        syncSelected(name);
      } else {
        window.STATE.data[name] = t.value;
      }
      clearError(name);
    }

    window.Storage.save(window.STATE.data);
    window.Renderer.applyVisibility();
    window.Nav.refresh();
  }

  /* ---------- submit ---------- */
  function buildPayload() {
    const payload = {};

    SCHEMA.allFields.forEach((f) => {
      if (!window.Validation.isVisible(f, window.STATE.data)) {
        return;
      }

      if (f.type === "checkbox") {
        const selected = Array.isArray(window.STATE.data[f.id])
          ? window.STATE.data[f.id]
          : [];

        f.options.forEach((opt) => {
          payload[opt.value] = selected.includes(opt.value) ? 1 : 0;
        });
      } else if (f.type === "matrix") {
        const matrix = window.STATE.data.q13 || {};

        f.items.forEach((item) => {
          payload[item.aCode] = matrix[item.aCode] || "";

          payload[item.bCode] = matrix[item.bCode] || "";
        });
      } else {
        payload[f.code] = window.STATE.data[f.id] ?? "";
      }
    });

    payload.submitted_at = new Date().toISOString();

    payload.university = window.APP_CONFIG.UNIVERSITY_NAME;

    return payload;
  }

  async function submit() {
    const errors = window.Validation.validateAll(window.STATE.data);
    if (Object.keys(errors).length) {
      const firstId = Object.keys(errors)[0];
      const field = SCHEMA.allFields.find((f) => f.id === firstId);
      window.Nav.show(field.section);
      setTimeout(
        () =>
          showErrors(
            window.Validation.validateSection(field.section, window.STATE.data),
            field.section,
          ),
        300,
      );
      return;
    }
    const payload = buildPayload();
    window.Swal.fire({
      title: "Mengirim jawaban...",
      didOpen: () => window.Swal.showLoading(),
      allowOutsideClick: false,
    });
    const res = await window.Api.submitForm(payload);
    if (res.placeholder) {
      window.Swal.fire({
        icon: "info",
        title: "Mode Placeholder",
        html: `${res.message}<br><br><small>Data valid & siap dikirim (lihat console).</small>`,
        confirmButtonColor: "#0F4C81",
      });
      return;
    }
    if (res.success) {
      window.Swal.fire({
        icon: "success",
        title: "Berhasil Terkirim!",
        text: "Terima kasih telah mengisi kuesioner Tracer Study.",
        confirmButtonColor: "#2E7D32",
      });
      window.Storage.clear();
    } else {
      window.Swal.fire({
        icon: "error",
        title: "Gagal Mengirim",
        text: res.error || "Terjadi kesalahan. Silakan coba lagi.",
        confirmButtonColor: "#D32F2F",
      });
    }
  }

  function resetForm() {
    window.Swal.fire({
      icon: "warning",
      title: "Reset formulir?",
      text: "Semua jawaban tersimpan akan dihapus.",
      showCancelButton: true,
      confirmButtonText: "Ya, reset",
      cancelButtonText: "Batal",
      confirmButtonColor: "#D32F2F",
    }).then((r) => {
      if (r.isConfirmed) {
        window.Storage.clear();
        location.reload();
      }
    });
  }

  /* ---------- init ---------- */
  function init() {
    window.STATE.data = window.Storage.load() || {};

    window.Renderer.renderAll();
    window.Renderer.applyVisibility();

    // restore selected styles
    SCHEMA.allFields.forEach((f) => {
      if (["radio", "checkbox", "likert"].includes(f.type)) syncSelected(f.id);
    });
    document
      .querySelectorAll('input[name^="q13__"]')
      .forEach((inp) => syncSelected(inp.name));

    // events
    document.addEventListener("input", onFieldChange);
    document.addEventListener("change", onFieldChange);

    document
      .getElementById("btn-next")
      .addEventListener("click", () => window.Nav.next());
    document
      .getElementById("btn-prev")
      .addEventListener("click", () => window.Nav.prev());
    document.getElementById("btn-submit").addEventListener("click", submit);
    document.getElementById("btn-reset").addEventListener("click", resetForm);

    // delegated: stepper + review edit
    document.addEventListener("click", (e) => {
      const stepBtn = e.target.closest("[data-step-nav]");
      if (stepBtn) {
        window.Nav.show(stepBtn.getAttribute("data-step-nav"));
        return;
      }
      const editBtn = e.target.closest("[data-goto]");
      if (editBtn) {
        window.Nav.show(editBtn.getAttribute("data-goto"));
        return;
      }
    });

    // start step
    const saved = window.Storage.loadStep();
    window.Nav.show(saved || "identity");
  }

  return { init, showErrors, buildPayload, submit };
})();

document.addEventListener("DOMContentLoaded", () => window.App.init());
