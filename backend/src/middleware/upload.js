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
		const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg';
		const safeExt = allowedExt.has(ext) ? ext : '.jpg';
		const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`;
		cb(null, name);
	},
});

const upload = multer({
	storage,
	fileFilter: function (_req, file, cb) {
		if (file.mimetype && file.mimetype.startsWith('image/')) return cb(null, true);
		const err = new Error('Only image files are allowed');
		err.status = 400;
		return cb(err);
	},
	limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadSingleImage = upload.single('image');

module.exports = { uploadSingleImage };
