/**
 * Routes d'auth.
 * Les handlers sont dans controllers/auth.controller.js
 */
const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { signup, login, logout, me } = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth');
const { validateSignup, validateLogin } = require('../validators/auth.validators');

const router = express.Router();

router.post('/signup', validateSignup, asyncHandler(signup));
router.post('/login', validateLogin, asyncHandler(login));
router.post('/logout', asyncHandler(logout));
// Retourne l'utilisateur connecté
router.get('/me', requireAuth, asyncHandler(me));

module.exports = router;
