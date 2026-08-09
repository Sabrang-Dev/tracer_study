/**
 * ==========================================================
 * Response.gs
 * Standard Response
 * ==========================================================
 */

function responseOutput(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function responseSuccess(message, data) {
  return responseOutput({
    success: true,
    message: message || "Success",
    data: data || null,
    errors: null,
    timestamp: new Date().toISOString(),
  });
}

function responseError(message, errors) {
  return responseOutput({
    success: false,
    message: message || "Error",
    data: null,
    errors: errors || null,
    timestamp: new Date().toISOString(),
  });
}
