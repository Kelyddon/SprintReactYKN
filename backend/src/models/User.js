/**
 * Modèle Mongoose User.
 * - Stocke passwordHash (jamais le mot de passe en clair)
 * - verifyPassword: compare bcrypt
 * - toJSON: enlève passwordHash des réponses API
 * - hook: suppression en cascade des posts lors de la suppression d'un user
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true, unique: true, lowercase: true },
    email: { type: String, required: true, trim: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.methods.verifyPassword = function verifyPassword(password) {
  // Compare le mot de passe fourni avec le hash stocké
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.set('toJSON', {
  transform: function (_doc, ret) {
    // Masque le hash du mot de passe dans toutes les réponses
    delete ret.passwordHash;
    return ret;
  },
});

userSchema.pre('findOneAndDelete', async function preFindOneAndDelete(next) {
  try {
    // Avant de supprimer un user, on supprime ses posts
    const user = await this.model.findOne(this.getFilter());
    if (user) {
      const Post = mongoose.model('Post');
      await Post.deleteMany({ user: user._id });
    }
    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model('User', userSchema);
