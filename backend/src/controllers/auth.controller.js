/**
 * Contrôleur d'authentification.
 * - signup/login: crée un user / vérifie le mot de passe
 * - pose un JWT dans un cookie httpOnly
 * - me: renvoie l'utilisateur courant (req.user)
 */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getCookieOptions } = require('../utils/cookie');

// Crée un JWT (sub = userId)
function signToken(userId) {
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn });
}

// On renvoie un user "safe" (sans passwordHash)
function sanitizeUser(user) {
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
  };
}

async function signup(req, res) {
  const { firstName, lastName, username, email, password } = req.body;

  // Hash du mot de passe avant stockage
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    firstName,
    lastName,
    username: String(username).toLowerCase(),
    email: String(email).toLowerCase(),
    passwordHash,
  });

  const token = signToken(user._id.toString());
  const cookieName = process.env.COOKIE_NAME || 'token';
  // Cookie httpOnly pour éviter l'accès JS côté navigateur
  res.cookie(cookieName, token, { ...getCookieOptions(req), maxAge: 1000 * 60 * 60 * 24 * 7 });

  return res.status(201).json({ user: sanitizeUser(user) });
}

async function login(req, res) {
  const { email, password } = req.body;

  // Recherche par email
  const user = await User.findOne({ email: String(email).toLowerCase() });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Vérification du mot de passe via bcrypt
  const ok = await user.verifyPassword(password);
  if (!ok) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = signToken(user._id.toString());
  const cookieName = process.env.COOKIE_NAME || 'token';
  res.cookie(cookieName, token, { ...getCookieOptions(req), maxAge: 1000 * 60 * 60 * 24 * 7 });

  return res.status(200).json({ user: sanitizeUser(user) });
}

async function logout(req, res) {
  const cookieName = process.env.COOKIE_NAME || 'token';
  // Supprime le cookie côté client
  res.clearCookie(cookieName, { ...getCookieOptions(req) });
  return res.status(204).send();
}

async function me(req, res) {
  // req.user est défini par le middleware requireAuth
  return res.status(200).json({ user: sanitizeUser(req.user) });
}

module.exports = { signup, login, logout, me };
