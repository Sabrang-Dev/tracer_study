/**
 * ==========================================================
 * Header.gs
 * Membuat Header Spreadsheet
 * ==========================================================
 */

const HEADER_METADATA = ["uuid", "created_at", "updated_at"];

const HEADER_FIELDS = [
  // ======================================================
  // IDENTITAS
  // ======================================================

  "nimhsmsmh",
  "kdptimsmh",
  "tahun_lulus",
  "kdpstmsmh",
  "nmmhsmsmh",
  "telpomsmh",
  "emailmsmh",
  "nik",
  "npwp",
  "f8",

  // ======================================================
  // INFORMASI PEKERJAAN
  // ======================================================

  "f502_work",
  "f502_wira",
  "f505",
  "f5a1",
  "f5a2",
  "f1101",
  "f1102",
  "f5b",
  "f5c",
  "f5c_other",
  "f5d",
  "f5d_other",

  // ======================================================
  // STUDI LANJUT
  // ======================================================

  "f18a",
  "f18a_other",
  "f18b",
  "f18c",
  "f18d",

  "f1201",
  "f1202",

  // ======================================================
  // KOMPETENSI
  // ======================================================

  "f14",
  "f15",

  "f1761",
  "f1762",
  "f1763",
  "f1764",
  "f1765",
  "f1766",
  "f1767",
  "f1768",
  "f1769",
  "f1770",
  "f1771",
  "f1772",
  "f1773",
  "f1774",

  // ======================================================
  // METODE PEMBELAJARAN
  // ======================================================

  "f21",
  "f22",
  "f23",
  "f24",
  "f25",
  "f26",
  "f27",

  // ======================================================
  // PENCARIAN KERJA
  // ======================================================

  "f301",
  "f302",
  "f303",

  "q16",

  "f416",

  "f6",
  "f7",
  "f7a",

  "f1001",
  "f1002",

  "q21",

  "f1614",
];

/**
 * Membuat header spreadsheet.
 */
function headerCreate() {
  const sheet = sheetGet(APP_CONFIG.SHEET_RESPONSES);

  if (sheet.getLastRow() > 0) {
    Logger.log("Header sudah ada.");
    return;
  }

  const headers = HEADER_METADATA.concat(HEADER_FIELDS);

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  sheet
    .getRange(1, 1, 1, headers.length)
    .setFontWeight("bold")
    .setBackground("#1F4E78")
    .setFontColor("#FFFFFF");

  sheet.setFrozenRows(1);

  sheet.autoResizeColumns(1, headers.length);

  Logger.log("Header berhasil dibuat.");
}

/**
 * Mengambil seluruh header.
 */
function headerGetAll() {
  return HEADER_METADATA.concat(HEADER_FIELDS);
}
