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

// Register models early (needed for mongoose.model('Post') in cascade delete)
require('./models/User');
require('./models/Post');

function createApp() {
  const app = express();

  app.use(helmet());
  app.use(morgan('dev'));

  app.use(cookieParser());
  app.use(express.json());

  const origin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
  app.use(
    cors({
      origin,
      credentials: true,
    })
  );

  // Static uploads
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

  // API
  app.use('/api', authRoutes);
  app.use('/api', userRoutes);
  app.use('/api', postRoutes);

  app.get('/api/health', (_req, res) => res.json({ ok: true }));

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
