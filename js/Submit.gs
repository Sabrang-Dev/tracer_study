/**
 * ==========================================================
 * Submit.gs
 * Menyimpan Data Tracer Study
 * ==========================================================
 */

function submitSave(data) {
  try {
    // ==========================================
    // Validasi
    // ==========================================

    const validation = validationSubmit(data);

    if (!validation.valid) {
      return responseError("Validasi gagal.", validation.errors);
    }

    // ==========================================
    // Cek Duplikasi NIM
    // ==========================================

    const duplicate = repositoryFindByNIM(data.nimhsmsmh);

    if (duplicate) {
      return responseError("NIM sudah pernah mengisi Tracer Study.");
    }

    // ==========================================
    // Metadata
    // ==========================================

    const payload = {
      uuid: utilsUuid(),

      created_at: utilsNow(),

      updated_at: "",

      ...data,
    };

    // ==========================================
    // Simpan Data
    // ==========================================

    repositoryInsert(payload);
    Logger.log(JSON.stringify(payload));
    Logger.log("DATA BERHASIL DISIMPAN");

    return responseSuccess("Data berhasil disimpan.", {
      uuid: payload.uuid,
      nim: payload.nimhsmsmh,
    });
  } catch (err) {
    utilsLog(err);

    return responseError(err.message);
  }
}
