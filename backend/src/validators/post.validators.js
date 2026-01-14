/**
 * Validateurs (express-validator) pour les posts.
 * - validatePostId: vérifie que l'id est un ObjectId valide
 * - validateCreatePost: description + image obligatoire
 * - validateUpdatePost: description optionnelle
 */
const { body, check, param } = require('express-validator');
const { validate } = require('../middleware/validate');

const validatePostId = [
  param('id').isMongoId().withMessage('Invalid post id'),
  validate,
];

const validateCreatePost = [
  body('description')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage('Description is too long (max 1000 chars)'),
  check('image').custom((_value, { req }) => {
    if (!req.file) throw new Error('Image is required');
    return true;
  }),
  validate,
];

const validateUpdatePost = [
  body('description')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Description cannot be empty')
    .isLength({ max: 1000 })
    .withMessage('Description is too long (max 1000 chars)'),
  validate,
];

module.exports = {
  validatePostId,
  validateCreatePost,
  validateUpdatePost,
};
