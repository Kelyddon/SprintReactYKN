/**
 * Validateurs (express-validator) pour l'auth.
 * Objectif: refuser les payloads invalides avant d'entrer dans les contrôleurs.
 */
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');

const validateSignup = [
  body('firstName').trim().notEmpty().withMessage('firstName is required'),
  body('lastName').trim().notEmpty().withMessage('lastName is required'),
  body('username')
    .trim()
    .notEmpty()
    .withMessage('username is required')
    .toLowerCase(),
  body('email').trim().isEmail().withMessage('email must be valid').toLowerCase(),
  body('password')
    .isString()
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 characters'),
  validate,
];

const validateLogin = [
  body('email').trim().isEmail().withMessage('email must be valid').toLowerCase(),
  body('password').isString().notEmpty().withMessage('password is required'),
  validate,
];

module.exports = { validateSignup, validateLogin };
