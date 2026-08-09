/**
 * validation.js — Client-side only validation.
 * Validates only fields that are currently VISIBLE (per conditional rules).
 */
window.Validation = (function () {
  function evalCondition(cond, state) {
    if (!cond) return true;
    const v = state[cond.field];
    switch (cond.op) {
      case "eq":
        return v === cond.value;
      case "neq":
        return v !== cond.value;
      case "in":
        return Array.isArray(cond.value) && cond.value.includes(v);
      case "includes":
        return Array.isArray(v) && v.includes(cond.value);
      default:
        console.warn(`Unknown condition operator: ${cond.op}`);
        return false;
    }
  }

  function isVisible(field, state) {
    if (!evalCondition(field.condition, state)) return false;
    // Transitive check: a field can only be visible if the field its condition
    // references is itself visible. Prevents stale sub-field state from keeping
    // hidden branches (and their steps) alive.
    if (field.condition) {
      const parent = window.FORM_SCHEMA.allFields.find(
        (f) => f.id === field.condition.field,
      );
      if (parent && parent.id !== field.id && !isVisible(parent, state))
        return false;
    }
    return true;
  }

  function isEmpty(field, state) {
    const v = state[field.id];
    if (field.type === "checkbox") return !Array.isArray(v) || v.length === 0;
    if (field.type === "matrix") {
      const obj = v || {};
      for (const item of field.items) {
        if (obj[item.aCode] === undefined || obj[item.bCode] === undefined)
          return true;
      }
      return false;
    }
    return v === undefined || v === null || String(v).trim() === "";
  }

  function validateField(field, state) {
    if (!isVisible(field, state)) return null;
    if (field.required && isEmpty(field, state)) {
      return "Pertanyaan ini wajib diisi.";
    }
    if (field.type === "email" && state[field.id]) {
      const value = String(state[field.id]).trim();

      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!re.test(value)) {
        return "Format email tidak valid.";
      }
    }
    if (
      field.type === "number" &&
      state[field.id] !== undefined &&
      state[field.id] !== ""
    ) {
      if (isNaN(Number(state[field.id]))) return "Harus berupa angka.";
    }
    return null;
  }

  /** Validate all visible fields belonging to a given section id. */
  function validateSection(sectionId, state) {
    const section = window.FORM_SCHEMA.sections.find((s) => s.id === sectionId);
    const errors = {};
    if (!section) return errors;
    section.fields.forEach((f) => {
      const err = validateField(f, state);
      if (err) errors[f.id] = err;
    });
    return errors;
  }

  /** Validate the entire form (all visible fields). */
  function validateAll(state) {
    const errors = {};
    window.FORM_SCHEMA.allFields.forEach((f) => {
      const err = validateField(f, state);
      if (err) errors[f.id] = err;
    });
    return errors;
  }

  return {
    evalCondition,
    isVisible,
    isEmpty,
    validateField,
    validateSection,
    validateAll,
  };
})();
