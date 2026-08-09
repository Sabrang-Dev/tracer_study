/**
 * ==========================================================
 * Install.gs
 * Inisialisasi Spreadsheet
 * Jalankan SATU KALI
 * ==========================================================
 */

function install() {
  try {
    // Buat sheet RESPONSES bila belum ada
    if (!sheetExists(APP_CONFIG.SHEET_RESPONSES)) {
      sheetCreate(APP_CONFIG.SHEET_RESPONSES);
    }

    // Buat Header
    headerCreate();

    Logger.log("========================================");
    Logger.log("Tracer Study Installation Success");
    Logger.log("Spreadsheet ID : " + APP_CONFIG.SPREADSHEET_ID);
    Logger.log("Sheet          : " + APP_CONFIG.SHEET_RESPONSES);
    Logger.log("========================================");

    return responseSuccess("Install berhasil.");
  } catch (err) {
    Logger.log(err);

    return responseError(err.message);
  }
}
