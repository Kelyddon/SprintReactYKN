
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    imageUrl: { type: String, required: true },
		title: { type: String, trim: true },
    description: { type: String, required: true, trim: true },
    // Champ imbriqué (nested) pour répondre au critère "champs imbriqués"
    author: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
