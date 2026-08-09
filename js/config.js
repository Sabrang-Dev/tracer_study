/**
 * config.js
 * Seluruh konfigurasi aplikasi dipusatkan di file ini.
 * File lain tidak boleh meng-hardcode nilai konfigurasi.
 */

window.APP_CONFIG = {
  // ------------------------------------------------------------------
  // Informasi Aplikasi
  // ------------------------------------------------------------------

  APP_NAME: "Tracer Study",

  APP_SUBTITLE: "Sistem Survei Alumni",

  UNIVERSITY_NAME: "Universitas",

  VERSION: "1.0.0",

  DEBUG: false,

  // ------------------------------------------------------------------
  // Google Apps Script
  // AKfycbyaJmxMg1WgZte71Yt9J12gtKpl6y_Lm7XRrvym5jOg7Z_kFhaaLtyabSsif9X5eN1U
  // ------------------------------------------------------------------

  GAS_URL:
    "https://script.google.com/macros/s/AKfycbyaJmxMg1WgZte71Yt9J12gtKpl6y_Lm7XRrvym5jOg7Z_kFhaaLtyabSsif9X5eN1U/exec",

  SUBMIT_TIMEOUT: 20000,

  // ------------------------------------------------------------------
  // Local Storage
  // ------------------------------------------------------------------

  STORAGE_KEY: "tracer_study_form_v1",

  STEP_KEY: "tracer_study_step_v1",

  // ------------------------------------------------------------------
  // API
  // ------------------------------------------------------------------

  API_ACTION: {
    SUBMIT: "submit",
  },

  // ------------------------------------------------------------------
  // UI
  // ------------------------------------------------------------------

  SCROLL_BEHAVIOR: "smooth",

  AUTO_SAVE: true,
};
