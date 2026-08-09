/**
 * renderer.js — Generic, schema-driven UI renderer.
 * Builds the ENTIRE questionnaire UI from window.FORM_SCHEMA.
 * No questionnaire content is hardcoded here.
 */
window.Renderer = (function () {
  const S = () => window.STATE.data;

  const esc = (str) =>
    String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  /* ---------- Field controls ---------- */

  function numberBadge(field) {
    return field.number
      ? `<span class="q-badge" aria-hidden="true">${field.number}</span>`
      : "";
  }

  function labelBlock(field) {
    const req = field.required ? `<span class="req">*</span>` : "";
    const desc = field.description
      ? `<p class="field-desc">${esc(field.description)}</p>`
      : "";
    return `
      <div class="field-head">
        ${numberBadge(field)}
        <div>
          <label class="field-label" for="${field.id}">${esc(field.label)} ${req}</label>
          ${desc}
        </div>
      </div>`;
  }

  function textControl(field) {
    const type =
      field.type === "email"
        ? "email"
        : field.type === "tel"
          ? "tel"
          : field.type === "number"
            ? "number"
            : field.type === "date"
              ? "date"
              : "text";
    const val = esc(S()[field.id] ?? "");
    return `<input id="${field.id}" name="${field.id}" type="${type}" value="${val}"
      class="ts-input" data-testid="input-${field.id}" autocomplete="off" />`;
  }

  function textareaControl(field) {
    const val = esc(S()[field.id] ?? "");
    return `<textarea id="${field.id}" name="${field.id}" rows="3"
      class="ts-input" data-testid="input-${field.id}">${val}</textarea>`;
  }

  function selectControl(field) {
    const cur = S()[field.id] ?? "";
    const opts = (field.options || [])
      .map(
        (o) =>
          `<option value="${esc(o.value)}" ${cur === o.value ? "selected" : ""}>${esc(o.label)}</option>`,
      )
      .join("");
    const todo = field.todo
      ? `<span class="todo-badge" title="Nilai dropdown tidak tersedia di PDF">TODO: opsi belum tersedia</span>`
      : "";
    return `
      <select id="${field.id}" name="${field.id}" class="ts-input ts-select" data-testid="select-${field.id}" ${field.todo ? "disabled" : ""}>
        <option value="" ${cur === "" ? "selected" : ""} disabled>Silahkan Pilih</option>
        ${opts}
      </select>${todo}`;
  }

  function radioControl(field) {
    const cur = S()[field.id];
    const items = field.options
      .map((o) => {
        const active = cur === o.value ? "is-selected" : "";
        return `
        <label class="opt-card ${active}" data-testid="radio-${field.id}-${o.value}">
          <input type="radio" name="${field.id}" value="${esc(o.value)}" ${cur === o.value ? "checked" : ""} class="opt-input" />
          <span class="opt-dot"></span>
          <span class="opt-text">${esc(o.label)}</span>
        </label>`;
      })
      .join("");
    return `<div class="opt-list">${items}</div>`;
  }

  function checkboxControl(field) {
    const cur = Array.isArray(S()[field.id]) ? S()[field.id] : [];
    const items = field.options
      .map((o) => {
        const on = cur.includes(o.value);
        return `
        <label class="opt-card ${on ? "is-selected" : ""}" data-testid="checkbox-${field.id}-${o.value}">
          <input type="checkbox" name="${field.id}" value="${esc(o.value)}" ${on ? "checked" : ""} class="opt-input" />
          <span class="opt-check"><i data-lucide="check"></i></span>
          <span class="opt-text">${esc(o.label)}</span>
        </label>`;
      })
      .join("");
    return `<div class="opt-list">${items}</div>`;
  }

  function likertControl(field) {
    const cur = S()[field.id];
    const items = field.options
      .map((o) => {
        const active = cur === o.value ? "is-selected" : "";
        return `
        <label class="likert-pill ${active}" data-testid="likert-${field.id}-${o.value}" title="${esc(o.label)}">
          <input type="radio" name="${field.id}" value="${esc(o.value)}" ${cur === o.value ? "checked" : ""} class="opt-input" />
          <span class="likert-num">${esc(o.value)}</span>
          <span class="likert-label">${esc(o.label)}</span>
        </label>`;
      })
      .join("");
    return `<div class="likert-row">${items}</div>`;
  }

  function matrixDimension(field, item, dim) {
    const code = dim.key === "A" ? item.aCode : item.bCode;
    const obj = S().q13 || {};
    const cur = obj[code];
    const scale = field.scale
      .map((sc) => {
        const active = cur === sc.value ? "is-selected" : "";
        return `
        <label class="scale-pill ${active}" data-testid="matrix-${code}-${sc.value}" title="${esc(sc.label)}">
          <input type="radio" name="q13__${code}" value="${esc(sc.value)}" ${cur === sc.value ? "checked" : ""} class="opt-input" />
          <span>${esc(sc.value)}</span>
        </label>`;
      })
      .join("");
    return `
      <div class="matrix-dim">
        <div class="matrix-dim-title">${esc(dim.label)} <span class="matrix-code">(${esc(code)})</span></div>
        <div class="scale-row">${scale}</div>
        <div class="scale-legend"><span>${esc(field.scale[0].label)}</span><span>${esc(field.scale[field.scale.length - 1].label)}</span></div>
      </div>`;
  }

  function matrixControl(field) {
    const cards = field.items
      .map(
        (item) => `
      <div class="comp-card" data-testid="comp-${item.aCode}">
        <div class="comp-name">${esc(item.name)}</div>
        <div class="comp-grid">
          ${matrixDimension(field, item, field.dimensions[0])}
          ${matrixDimension(field, item, field.dimensions[1])}
        </div>
      </div>`,
      )
      .join("");
    return `<div class="comp-list">${cards}</div>`;
  }

  function control(field) {
    switch (field.type) {
      case "textarea":
        return textareaControl(field);
      case "select":
        return selectControl(field);
      case "radio":
        return radioControl(field);
      case "checkbox":
        return checkboxControl(field);
      case "likert":
        return likertControl(field);
      case "matrix":
        return matrixControl(field);
      default:
        return textControl(field);
    }
  }

  function renderField(field) {
    const spanFull =
      field.full ||
      ["radio", "checkbox", "likert", "matrix", "textarea"].includes(
        field.type,
      );
    return `
      <div class="field-wrap ${spanFull ? "col-full" : ""}" data-field-id="${field.id}" data-testid="field-${field.id}">
        ${labelBlock(field)}
        <div class="field-control">${control(field)}</div>
        <p class="field-error" data-error-for="${field.id}" hidden></p>
      </div>`;
  }

  function renderSection(section) {
    const body =
      section.id === "review"
        ? `<div id="review-body" data-testid="review-body"></div>`
        : `<div class="fields-grid">${section.fields.map(renderField).join("")}</div>`;
    return `
      <section class="step-panel" data-step="${section.id}" hidden>
        <div class="card">
          <div class="card-header">
            <div class="card-icon"><i data-lucide="${section.icon}"></i></div>
            <div>
              <h2 class="card-title">${esc(section.title)}</h2>
              <p class="card-subtitle">${esc(section.description)}</p>
            </div>
          </div>
          <div class="card-body">${body}</div>
        </div>
      </section>`;
  }

  function renderAll() {
    const container = document.getElementById("steps-container");
    container.innerHTML = window.FORM_SCHEMA.sections
      .map(renderSection)
      .join("");
    if (window.lucide) window.lucide.createIcons();
  }

  /* ---------- Visibility ---------- */

  function applyVisibility() {
    const visibilityMap = {};

    // PASS 1
    // Hitung visibility seluruh field terlebih dahulu
    window.FORM_SCHEMA.allFields.forEach((field) => {
      visibilityMap[field.id] = window.Validation.isVisible(field, S());
    });

    // PASS 2
    // Update UI berdasarkan hasil visibility
    window.FORM_SCHEMA.allFields.forEach((field) => {
      const el = document.querySelector(
        `.field-wrap[data-field-id="${field.id}"]`,
      );

      if (!el) return;

      const visible = visibilityMap[field.id];
      const wasHidden = el.hidden;

      el.hidden = !visible;

      el.querySelectorAll("input, select, textarea").forEach((input) => {
        input.disabled = !visible;
      });

      // Clear hanya ketika berubah dari visible -> hidden
      if (!visible && !wasHidden) {
        clearFieldValue(field, el);
      }
    });
  }

  function clearFieldValue(field, element) {
    switch (field.type) {
      case "checkbox":
        window.STATE.data[field.id] = [];

        element
          .querySelectorAll("input[type='checkbox']")
          .forEach((input) => (input.checked = false));

        break;

      case "radio":
        delete window.STATE.data[field.id];

        element
          .querySelectorAll("input[type='radio']")
          .forEach((input) => (input.checked = false));

        break;

      case "select":
        delete window.STATE.data[field.id];

        const select = element.querySelector("select");

        if (select) {
          select.selectedIndex = 0;
        }

        break;

      case "matrix":
        window.STATE.data[field.id] = {};

        element
          .querySelectorAll("input[type='radio']")
          .forEach((input) => (input.checked = false));

        break;

      default:
        delete window.STATE.data[field.id];

        const input = element.querySelector("input, textarea");

        if (input) {
          input.value = "";
        }
    }

    // Bersihkan error UI
    const error = element.querySelector(".field-error");

    if (error) {
      error.hidden = true;
      error.textContent = "";
    }
  }

  function setDisabled(el, disabled) {
    el.querySelectorAll("input,select,textarea").forEach((i) => {
      i.disabled = disabled;
    });
  }

  /** Sections that currently have at least one visible field (review always visible). */
  function visibleSections() {
    return window.FORM_SCHEMA.sections.filter((s) => {
      if (s.id === "review") return true;
      return s.fields.some((f) => window.Validation.isVisible(f, S()));
    });
  }

  /* ---------- Display helpers (for review) ---------- */

  function displayValue(field) {
    const v = S()[field.id];
    if (field.type === "checkbox") {
      if (!Array.isArray(v) || !v.length) return null;
      return v
        .map(
          (val) =>
            (field.options.find((o) => o.value === val) || {}).label || val,
        )
        .join(", ");
    }
    if (
      field.type === "radio" ||
      field.type === "likert" ||
      field.type === "select"
    ) {
      if (v === undefined || v === "") return null;
      const o = (field.options || []).find((x) => x.value === v);
      return o ? o.label : v;
    }
    if (field.type === "matrix") {
      const obj = S().q13 || {};
      const rows = field.items
        .map((it) => {
          const a = obj[it.aCode],
            b = obj[it.bCode];
          if (!a && !b) return null;
          return `${esc(it.name)} — A: ${a || "-"} , B: ${b || "-"}`;
        })
        .filter(Boolean);
      return rows.length ? rows.join("<br>") : null;
    }
    return v === undefined || String(v).trim() === "" ? null : v;
  }

  function renderReview() {
    const body = document.getElementById("review-body");
    if (!body) return;
    const blocks = window.FORM_SCHEMA.sections
      .filter((s) => s.id !== "review")
      .map((s) => {
        const rows = s.fields
          .filter((f) => window.Validation.isVisible(f, S()))
          .map((f) => {
            const val = displayValue(f);
            return `
              <div class="review-row" data-testid="review-row-${f.id}">
                <div class="review-q">${f.number ? `<b>${f.number}.</b> ` : ""}${esc(f.label)}</div>
                <div class="review-a ${val ? "" : "empty"}">${val ? val : "<em>Belum diisi</em>"}</div>
              </div>`;
          })
          .join("");
        return `
          <div class="review-block" data-testid="review-block-${s.id}">
            <div class="review-block-head">
              <div class="review-block-title"><i data-lucide="${s.icon}"></i> ${esc(s.title)}</div>
              <button type="button" class="btn-ghost btn-edit" data-goto="${s.id}" data-testid="edit-${s.id}">
                <i data-lucide="pencil"></i> Edit
              </button>
            </div>
            <div class="review-rows">${rows || '<p class="review-empty">Tidak ada data.</p>'}</div>
          </div>`;
      })
      .join("");
    body.innerHTML = blocks;
    if (window.lucide) window.lucide.createIcons();
  }

  return { renderAll, applyVisibility, visibleSections, renderReview };
})();
