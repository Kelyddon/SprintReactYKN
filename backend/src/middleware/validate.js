/**
 * Middleware express-validator.
 * Transforme les erreurs de validation en réponse JSON 400.
 */
const { validationResult } = require('express-validator');

function validate(req, res, next) {
  // Récupère le résultat des validateurs déclarés dans les routes
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result.array({ onlyFirstError: true }).map((e) => ({
    field: e.path,
    message: e.msg,
  }));

  return res.status(400).json({
    message: 'Invalid input',
    errors,
  });
}

module.exports = { validate };
