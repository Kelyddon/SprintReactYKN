/**
 * Routes des posts.
 * - /posts: liste publique
 * - /posts/me: posts de l'utilisateur connecté
 * - CRUD protégé par requireAuth
 */
const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const { requireAuth } = require('../middleware/auth');
const { uploadSingleImage } = require('../middleware/upload');
const { listPosts, listMyPosts, getPostById, createPost, updatePost, deletePost } = require('../controllers/post.controller');
const { validatePostId, validateCreatePost, validateUpdatePost } = require('../validators/post.validators');

const router = express.Router();

router.get('/posts', asyncHandler(listPosts));
// Route utilisée par le bouton "Mes posts" côté front
router.get('/posts/me', requireAuth, asyncHandler(listMyPosts));
router.get('/posts/:id', validatePostId, asyncHandler(getPostById));
router.post('/posts', requireAuth, uploadSingleImage, validateCreatePost, asyncHandler(createPost));
router.put('/posts/:id', requireAuth, uploadSingleImage, validateUpdatePost, asyncHandler(updatePost));
router.delete('/posts/:id', requireAuth, validatePostId, asyncHandler(deletePost));

module.exports = router;
