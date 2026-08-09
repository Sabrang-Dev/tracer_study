/**
 * ==========================================================
 * Code.gs
 * Entry Point
 * ==========================================================
 */

/**
 * Health Check
 */
function doGet(e) {
  return responseSuccess("Tracer Study API is running.", {
    timestamp: utilsNow(),
  });
}

/**
 * Main API Endpoint
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return responseError("Request body tidak ditemukan.");
    }

    const request = JSON.parse(e.postData.contents);

    if (!request.action) {
      return responseError("Parameter action wajib dikirim.");
    }

    return routerHandle(request);
  } catch (err) {
    return responseError(err.message);
  }
}
