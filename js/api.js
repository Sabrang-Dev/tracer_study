/**
 * api.js — Backend placeholder.
 * The real backend will be a Google Apps Script Web App.
 * Configure the endpoint URL in config.js (APP_CONFIG.GAS_URL).
 *
 *   submitForm(data)  ->  fetch()  ->  Google Apps Script URL
 */
window.Api = (function () {
  function isConfigured() {
    const url = window.APP_CONFIG.GAS_URL;
    return url && url !== "YOUR_GOOGLE_APPS_SCRIPT_URL";
  }

  async function submitForm(data) {
    if (!isConfigured()) {
      console.info("[Tracer Study] GAS_URL belum dikonfigurasi.", data);

      return {
        success: false,
        placeholder: true,
        message:
          "URL Google Apps Script belum dikonfigurasi. Silakan isi APP_CONFIG.GAS_URL.",
        data: null,
      };
    }

    const controller = new AbortController();

    const timer = setTimeout(() => {
      controller.abort();
    }, window.APP_CONFIG.SUBMIT_TIMEOUT);

    try {
      const response = await fetch(window.APP_CONFIG.GAS_URL, {
        method: "POST",

        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },

        body: JSON.stringify({
          action: APP_CONFIG.API_ACTION.SUBMIT,
          data: data,
        }),

        signal: controller.signal,
      });

      clearTimeout(timer);

      let result;

      try {
        result = await response.json();
      } catch (e) {
        return {
          success: false,
          placeholder: false,
          message: "Response dari server bukan JSON yang valid.",
          data: null,
        };
      }

      return {
        success: response.ok && result.success === true,

        placeholder: false,

        message:
          result.message || (response.ok ? "Berhasil." : "Terjadi kesalahan."),

        data: result.data || null,

        errors: result.errors || null,
      };
    } catch (err) {
      clearTimeout(timer);

      return {
        success: false,

        placeholder: false,

        message:
          err.name === "AbortError"
            ? "Permintaan melebihi batas waktu."
            : err.message || "Network error.",

        data: null,

        errors: null,
      };
    }
  }

  return { submitForm, isConfigured };
})();
