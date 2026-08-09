/**
 * ==========================================================
 * Router.gs
 * Router API
 * ==========================================================
 */

function routerHandle(request) {
  const action = request.action || "";

  switch (action) {
    case APP_CONFIG.API_ACTION.SUBMIT:
      return submitSave(request.data);

    default:
      return responseError(`Action "${action}" tidak dikenali.`);
  }
}
