/**
 * Connexion à MongoDB via Mongoose.
 * La variable d'environnement attendue est MONGODB_URI.
 */
const mongoose = require('mongoose');

async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI manque dans les variables d\'environnement');

  // strictQuery évite certains comportements ambigus sur les filtres.
  mongoose.set('strictQuery', true);

  // On laisse l'erreur remonter: elle est gérée au niveau du démarrage (server.js).
  await mongoose.connect(uri);
  return mongoose.connection;
}

module.exports = { connectDb };
