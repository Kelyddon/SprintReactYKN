/**
 * Contrôleur user.
 * Ici: suppression du compte (et cascade de suppression des posts via le hook Mongoose).
 */
const User = require('../models/User');

async function deleteMyAccount(req, res) {
  // Le hook User.pre('findOneAndDelete') supprime les posts de l'utilisateur.
  await User.findByIdAndDelete(req.user._id);
  return res.status(204).send();
}

module.exports = { deleteMyAccount };
