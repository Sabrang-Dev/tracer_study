/**
 * ==========================================================
 * SheetService.gs
 * Seluruh operasi Spreadsheet
 * ==========================================================
 */

/**
 * Mengambil Spreadsheet aktif.
 */
function sheetGetSpreadsheet() {
  return SpreadsheetApp.openById(APP_CONFIG.SPREADSHEET_ID);
}

/**
 * Mengecek apakah sheet ada.
 */
function sheetExists(sheetName) {
  return sheetGetSpreadsheet().getSheetByName(sheetName) !== null;
}

/**
 * Mengambil sheet.
 */
function sheetGet(sheetName) {
  const sheet = sheetGetSpreadsheet().getSheetByName(sheetName);

  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" tidak ditemukan.`);
  }

  return sheet;
}

/**
 * Membuat sheet.
 */
function sheetCreate(sheetName) {
  if (sheetExists(sheetName)) {
    return sheetGet(sheetName);
  }

  return sheetGetSpreadsheet().insertSheet(sheetName);
}

/**
 * Menghapus sheet.
 */
function sheetDelete(sheetName) {
  if (!sheetExists(sheetName)) {
    return;
  }

  sheetGetSpreadsheet().deleteSheet(sheetGet(sheetName));
}

/**
 * Menghapus isi sheet.
 */
function sheetClear(sheetName) {
  const sheet = sheetGet(sheetName);

  sheet.clear();

  return sheet;
}

/**
 * Menghapus lalu membuat ulang sheet.
 */
function sheetRecreate(sheetName) {
  sheetDelete(sheetName);

  return sheetCreate(sheetName);
}

/**
 * Mengambil header.
 */
function sheetHeaders(sheetName) {
  const sheet = sheetGet(sheetName);

  if (sheet.getLastColumn() === 0) {
    return [];
  }

  return sheet
    .getRange(APP_CONFIG.HEADER_ROW, 1, 1, sheet.getLastColumn())
    .getValues()[0];
}

/**
 * Menambahkan satu baris.
 */
function sheetAppend(sheetName, data) {
  const sheet = sheetGet(sheetName);

  const headers = sheetHeaders(sheetName);

  if (headers.length === 0) {
    throw new Error("Header belum dibuat.");
  }

  const row = headers.map((header) => {
    return utilsNormalize(data[header]);
  });

  sheet.appendRow(row);

  return true;
}

/**
 * Mencari data.
 */
function sheetFind(sheetName, columnName, value) {
  const sheet = sheetGet(sheetName);

  const headers = sheetHeaders(sheetName);

  const column = headers.indexOf(columnName);

  if (column === -1) {
    throw new Error(`Kolom "${columnName}" tidak ditemukan.`);
  }

  const lastRow = sheet.getLastRow();

  if (lastRow <= APP_CONFIG.HEADER_ROW) {
    return null;
  }

  const values = sheet
    .getRange(
      APP_CONFIG.HEADER_ROW + 1,
      column + 1,
      lastRow - APP_CONFIG.HEADER_ROW,
      1,
    )
    .getValues();

  for (let i = 0; i < values.length; i++) {
    if (String(values[i][0]) === String(value)) {
      return {
        row: i + APP_CONFIG.HEADER_ROW + 1,

        value: values[i][0],
      };
    }
  }

  return null;
}

/**
 * Update satu baris.
 */
function sheetUpdate(sheetName, rowNumber, data) {
  const sheet = sheetGet(sheetName);

  const headers = sheetHeaders(sheetName);

  const row = headers.map((header) => {
    return utilsNormalize(data[header]);
  });

  sheet.getRange(rowNumber, 1, 1, headers.length).setValues([row]);

  return true;
}

/**
 * Mengambil semua data.
 */
function sheetAll(sheetName) {
  const sheet = sheetGet(sheetName);

  const headers = sheetHeaders(sheetName);

  const lastRow = sheet.getLastRow();

  if (lastRow <= APP_CONFIG.HEADER_ROW) {
    return [];
  }

  const values = sheet
    .getRange(
      APP_CONFIG.HEADER_ROW + 1,
      1,
      lastRow - APP_CONFIG.HEADER_ROW,
      headers.length,
    )
    .getValues();

  return values.map((row) => {
    const obj = {};

    headers.forEach((header, index) => {
      obj[header] = row[index];
    });

    return obj;
  });
}

/**
 * Mengambil daftar sheet.
 */
function sheetList() {
  return sheetGetSpreadsheet()
    .getSheets()
    .map((sheet) => sheet.getName());
}
