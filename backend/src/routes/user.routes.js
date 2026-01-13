const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { requireAuth } = require('../middleware/auth');
const { deleteMyAccount } = require('../controllers/user.controller');

const router = express.Router();

// suppression du comptes ainsi que mes posts
router.delete('/me', requireAuth, asyncHandler(deleteMyAccount));

module.exports = router;
