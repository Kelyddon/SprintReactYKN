/**
 * Gestion des erreurs Express.
 * - notFound: route inexistante
 * - errorHandler: handler global pour erreurs Multer, validation, Mongo duplicate key, etc.
 */
function notFound(_req, res) {
  return res.status(404).json({ message: 'Not found' });
}

function errorHandler(err, _req, res, _next) {
  // Erreurs Multer (upload)
  if (err && err.name === 'MulterError') {
    return res.status(400).json({ message: err.message });
  }

  if (
    err &&
    typeof err.message === 'string' &&
    (err.message.includes('Juste une image') || err.message.includes('Only image files are allowed'))
  ) {
    return res.status(400).json({ message: err.message });
  }

  // Mongo duplicate key
  if (err && err.code === 11000) {
    return res.status(409).json({ message: 'Duplicate value', details: err.keyValue });
  }

  // Fallback: erreur serveur
  const status = err.status || 500;
  const message = err.message || 'Server error';
  return res.status(status).json({ message });
}

module.exports = { notFound, errorHandler };
