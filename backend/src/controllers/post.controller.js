
const fs = require('fs');
const path = require('path');
const Post = require('../models/Post');

// Construit une URL publique vers le fichier (uploads/..)
function buildPublicImageUrl(req, filename) {
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
}

async function listPosts(req, res) {
  // Liste générale (publique)
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate('user', 'username firstName lastName');

  return res.status(200).json({ posts });
}

async function getPostById(req, res) {
  // Lecture par id + 404 si introuvable
  const post = await Post.findById(req.params.id).populate('user', 'username firstName lastName');
  if (!post) return res.status(404).json({ message: 'Post pas trouvé' });
  return res.status(200).json({ post });
}

async function createPost(req, res) {
  try {
		const { description, title } = req.body;

    // URL publique de l'image stockée dans /uploads
    const imageUrl = buildPublicImageUrl(req, req.file.filename);

    // Critère: création via new Model(...) puis save()
    const post = new Post({
      user: req.user._id,
      imageUrl,
			title: title !== undefined ? String(title).trim() : undefined,
      description: String(description).trim(),
      // Critère: champ imbriqué écrit à la création
      author: { id: req.user._id },
    });

    await post.save();
    return res.status(201).json({ post });
  } catch (err) {
    // En cas d'erreur (DB, fichier, etc.), on renvoie un 500 simple.
    return res.status(500).json({ message: 'Échec de la création du post' });
  }
}

// Critère: filtre sur champ imbriqué + cas d’usage "mes posts" (bouton côté front)
async function listMyPosts(req, res) {
  try {
    // Cas d'usage "mes posts": filtre par user connecté.
    // On filtre aussi sur un champ imbriqué (author.id) pour répondre au critère MongoDB.
    const posts = await Post.find({
      $or: [{ user: req.user._id }, { 'author.id': req.user._id }],
    })
      .sort({ createdAt: -1 })
      .populate('user', 'username firstName lastName');

    return res.status(200).json({ posts });
  } catch (err) {
    return res.status(500).json({ message: 'Échec de la récupération des posts' });
  }
}

function filenameFromImageUrl(imageUrl) {
  // Extraire le nom de fichier à partir de l'URL (utile pour supprimer l'ancien fichier)
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
  try {
    // On récupère le post pour:
    // - vérifier qu'il existe (404)
    // - vérifier que c'est le propriétaire (403)
    // - supprimer l'ancienne image si une nouvelle est uploadée
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post pas trouvé' });

    if (String(post.user) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Interdit' });
    }

    const update = {};

    const { description, title } = req.body;
		if (title !== undefined) {
			update.title = String(title).trim();
		}
    if (description !== undefined) {
      update.description = String(description).trim();
    }

    if (req.file) {
      // Si nouvelle image: suppression best-effort de l'ancienne
      const oldFilename = filenameFromImageUrl(post.imageUrl);
      const oldPath = path.join(__dirname, '..', '..', 'uploads', oldFilename);
      fs.promises.unlink(oldPath).catch(() => undefined);

      update.imageUrl = buildPublicImageUrl(req, req.file.filename);
    }

    // Critère: mise à jour via méthode dédiée
    const updated = await Post.findByIdAndUpdate(post._id, { $set: update }, { new: true, runValidators: true });
    return res.status(200).json({ post: updated });
  } catch (err) {
    // Erreur DB / validation / etc.
    return res.status(500).json({ message: 'Échec de la mise à jour du post' });
  }
}

async function deletePost(req, res) {
  // Suppression d'un post + suppression best-effort du fichier image
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post pas trouvé' });

  if (String(post.user) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Interdit' });
  }

  const filename = filenameFromImageUrl(post.imageUrl);
  const imgPath = path.join(__dirname, '..', '..', 'uploads', filename);

  await Post.findByIdAndDelete(post._id);
  fs.promises.unlink(imgPath).catch(() => undefined);

  return res.status(204).send();
}

module.exports = { listPosts, listMyPosts, getPostById, createPost, updatePost, deletePost };
