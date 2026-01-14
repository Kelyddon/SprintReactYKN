/**
 * Helper pour éviter de répéter try/catch dans les routes.
 * Si une promesse rejette, on passe l'erreur à next() (errorHandler).
 */
function asyncHandler(fn) {
  return function asyncWrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = { asyncHandler };
