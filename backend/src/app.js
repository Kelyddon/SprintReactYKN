/**
 * Construction de l'application Express.
 * Ici on configure:
 * - sécurité (helmet)
 * - logs HTTP (morgan)
 * - cookies et JSON
 * - CORS pour le front
 * - routes API
 * - gestion 404 + erreurs
 */
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const userRoutes = require('./routes/user.routes');

const { notFound, errorHandler } = require('./middleware/errorHandler');

// On enregistre les modèles tôt (utile pour mongoose.model('Post') dans certains hooks).
require('./models/User');
require('./models/Post');

function createApp() {
  const app = express();

  app.use(helmet());
  app.use(morgan('dev'));

  app.use(cookieParser());
  app.use(express.json());

  // Origine du front autorisée (Vite par défaut).
  const origin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
  app.use(
    cors({
      origin,
      credentials: true,
    })
  );

  // Accès public aux images uploadées
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

  // Routes API
  app.use('/api', authRoutes);
  app.use('/api', userRoutes);
  app.use('/api', postRoutes);

  // Route de santé simple
  app.get('/api/health', (_req, res) => res.json({ ok: true }));

  // 404 + handler global
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
