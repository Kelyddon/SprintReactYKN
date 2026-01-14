/**
 * Point d'entrée du serveur.
 * - Charge les variables d'environnement
 * - Vérifie la config minimale
 * - Se connecte à MongoDB
 * - Démarre l'API Express
 */
require('dotenv').config();

const { connectDb } = require('./config/db');
const { createApp } = require('./app');

async function main() {
  // Sécurité: on refuse de démarrer si la clé JWT n'est pas définie.
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing in env');
  }

  // Connexion Mongoose (MongoDB)
  await connectDb();

  const app = createApp();
  const port = Number(process.env.PORT || 4000);

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${port}`);
  });
}

// Si une erreur arrive pendant le démarrage, on log et on stop le process.
main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
