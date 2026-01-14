/**
 * Middleware d'authentification.
 * - Lit le JWT depuis un cookie httpOnly
 * - Vérifie le token
 * - Charge l'utilisateur en base et le place dans req.user
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function requireAuth(req, res, next) {
  try {
    const cookieName = process.env.COOKIE_NAME || 'token';
    const token = req.cookies?.[cookieName];

    if (!token) {
      return res.status(401).json({ message: 'Pas authentifié' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // sub = userId
    const user = await User.findById(payload.sub).select('-passwordHash');

    if (!user) {
      return res.status(401).json({ message: 'Pas authentifié' });
    }

    req.user = user;
    return next();
  } catch (err) {
    // Token invalide / expiré / absent
    return res.status(401).json({ message: 'Pas authentifié' });
  }
}

module.exports = { requireAuth };
