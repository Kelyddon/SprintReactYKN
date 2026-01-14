/**
 * Routes user.
 * Ici: suppression du compte.
 */
const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { requireAuth } = require('../middleware/auth');
const { deleteMyAccount } = require('../controllers/user.controller');

const router = express.Router();

// Suppression du compte (et des posts via cascade)
router.delete('/me', requireAuth, asyncHandler(deleteMyAccount));

module.exports = router;
