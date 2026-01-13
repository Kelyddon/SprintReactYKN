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
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.set('toJSON', {
  transform: function (_doc, ret) {
    delete ret.passwordHash;
    return ret;
  },
});

userSchema.pre('findOneAndDelete', async function preFindOneAndDelete(next) {
  try {
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
