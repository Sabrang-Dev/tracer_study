/**
 * storage.js - LocalStorage autosave & restore.
 */
window.Storage = (function () {
  const KEY = window.APP_CONFIG.STORAGE_KEY;
  const STEP_KEY = window.APP_CONFIG.STEP_KEY;

  function save(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Autosave gagal:", e);
    }
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveStep(id) {
    try {
      localStorage.setItem(STEP_KEY, String(id));
    } catch (e) {}
  }

  function loadStep() {
    return localStorage.getItem(STEP_KEY) || null;
  }

  function clear() {
    localStorage.removeItem(KEY);
    localStorage.removeItem(STEP_KEY);
  }

  return { save, load, saveStep, loadStep, clear };
})();
