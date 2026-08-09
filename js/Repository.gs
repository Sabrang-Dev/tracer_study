/**
 * ==========================================================
 * Repository.gs
 * Data Access Layer
 * ==========================================================
 */

/**
 * Simpan data tracer study.
 */
function repositoryInsert(data) {
  return sheetAppend(APP_CONFIG.SHEET_RESPONSES, data);
}

/**
 * Cari berdasarkan NIM.
 */
function repositoryFindByNIM(nim) {
  return sheetFind(APP_CONFIG.SHEET_RESPONSES, "nimhsmsmh", nim);
}

/**
 * Cari berdasarkan UUID.
 */
function repositoryFindByUUID(uuid) {
  return sheetFind(APP_CONFIG.SHEET_RESPONSES, "uuid", uuid);
}

/**
 * Update berdasarkan nomor baris.
 */
function repositoryUpdate(row, data) {
  return sheetUpdate(APP_CONFIG.SHEET_RESPONSES, row, data);
}

/**
 * Ambil seluruh data.
 */
function repositoryAll() {
  return sheetAll(APP_CONFIG.SHEET_RESPONSES);
}
