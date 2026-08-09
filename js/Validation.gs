/**
 * ==========================================================
 * Validation.gs
 * Validasi Request
 * ==========================================================
 */

/**
 * Validasi data submit tracer study.
 */
function validationSubmit(data) {
  const errors = {};

  // ==========================
  // Request
  // ==========================

  if (!data || typeof data !== "object") {
    return {
      valid: false,
      errors: {
        general: "Data request tidak valid.",
      },
    };
  }

  // ==========================
  // Identitas
  // ==========================

  if (utilsIsEmpty(data.nimhsmsmh)) {
    errors.nimhsmsmh = "NIM wajib diisi.";
  }

  if (utilsIsEmpty(data.nmmhsmsmh)) {
    errors.nmmhsmsmh = "Nama wajib diisi.";
  }

  if (utilsIsEmpty(data.emailmsmh)) {
    errors.emailmsmh = "Email wajib diisi.";
  } else {
    const email = String(data.emailmsmh).trim();

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(email)) {
      errors.emailmsmh = "Format email tidak valid.";
    }
  }

  if (utilsIsEmpty(data.telpomsmh)) {
    errors.telpomsmh = "Nomor HP wajib diisi.";
  }

  // ==========================
  // Status Alumni
  // ==========================

  if (utilsIsEmpty(data.f8)) {
    errors.f8 = "Status alumni wajib dipilih.";
  }

  return {
    valid: Object.keys(errors).length === 0,

    errors,
  };
}
