/**
 * ==========================================================
 * Utils.gs
 * Utility Functions
 * ==========================================================
 */

/**
 * Timestamp saat ini.
 */
function utilsNow() {
  return Utilities.formatDate(
    new Date(),
    APP_CONFIG.TIMEZONE,
    APP_CONFIG.DATETIME_FORMAT,
  );
}

/**
 * UUID.
 */
function utilsUuid() {
  return Utilities.getUuid();
}

/**
 * Mengecek apakah value kosong.
 */
function utilsIsEmpty(value) {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === "string") {
    return value.trim() === "";
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === "object") {
    return Object.keys(value).length === 0;
  }

  return false;
}

/**
 * Normalisasi nilai sebelum disimpan.
 */
function utilsNormalize(value) {
  if (value === undefined || value === null) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return value;
}

/**
 * Logging.
 */
function utilsLog(message, data) {
  if (!APP_CONFIG.DEBUG) {
    return;
  }

  if (data === undefined) {
    Logger.log(message);
  } else {
    Logger.log(message + " : " + JSON.stringify(data));
  }
}
