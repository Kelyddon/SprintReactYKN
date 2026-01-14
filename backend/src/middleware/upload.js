/**
 * Configuration Multer pour l'upload d'images.
 * - Stockage disque dans /uploads
 * - Génère un nom unique
 * - Vérifie que le fichier est une image
 * - Limite la taille (5MB)
 */
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadDir = path.join(__dirname, '..', '..', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const allowedExt = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const storage = multer.diskStorage({
	destination: function (_req, _file, cb) {
		cb(null, uploadDir);
	},
	filename: function (_req, file, cb) {
		// On garde l'extension si elle est autorisée, sinon on force .jpg
		const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg';
		const safeExt = allowedExt.has(ext) ? ext : '.jpg';
		const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`;
		cb(null, name);
	},
});

const upload = multer({
	storage,
	fileFilter: function (_req, file, cb) {
		// On accepte uniquement les images
		if (file.mimetype && file.mimetype.startsWith('image/')) return cb(null, true);
		const err = new Error('Images uniquement autorisées');
		err.status = 400;
		return cb(err);
	},
	// Taille max: 5MB
	limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadSingleImage = upload.single('image');

module.exports = { uploadSingleImage };
