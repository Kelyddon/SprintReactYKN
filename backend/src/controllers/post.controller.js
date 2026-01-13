const fs = require('fs');
const path = require('path');
const Post = require('../models/Post');

function buildPublicImageUrl(req, filename) {
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
}

async function listPosts(req, res) {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate('user', 'username firstName lastName');

  return res.status(200).json({ posts });
}

async function getPostById(req, res) {
  const post = await Post.findById(req.params.id).populate('user', 'username firstName lastName');
  if (!post) return res.status(404).json({ message: 'Post not found' });
  return res.status(200).json({ post });
}

async function createPost(req, res) {
  const { description } = req.body;

  const imageUrl = buildPublicImageUrl(req, req.file.filename);

  const post = await Post.create({
    user: req.user._id,
    imageUrl,
    description: String(description).trim(),
  });

  return res.status(201).json({ post });
}

function filenameFromImageUrl(imageUrl) {
  try {
    const url = new URL(imageUrl);
    const parts = url.pathname.split('/');
    return parts[parts.length - 1];
  } catch {
    const parts = String(imageUrl).split('/');
    return parts[parts.length - 1];
  }
}

async function updatePost(req, res) {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  if (String(post.user) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { description } = req.body;
  if (description !== undefined) {
    post.description = String(description).trim();
  }

  if (req.file) {
    const oldFilename = filenameFromImageUrl(post.imageUrl);
    const oldPath = path.join(__dirname, '..', '..', 'uploads', oldFilename);
    fs.promises.unlink(oldPath).catch(() => undefined);

    post.imageUrl = buildPublicImageUrl(req, req.file.filename);
  }

  await post.save();
  return res.status(200).json({ post });
}

async function deletePost(req, res) {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  if (String(post.user) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const filename = filenameFromImageUrl(post.imageUrl);
  const imgPath = path.join(__dirname, '..', '..', 'uploads', filename);

  await Post.findByIdAndDelete(post._id);
  fs.promises.unlink(imgPath).catch(() => undefined);

  return res.status(204).send();
}

module.exports = { listPosts, getPostById, createPost, updatePost, deletePost };
