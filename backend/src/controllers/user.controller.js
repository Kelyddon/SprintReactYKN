const User = require('../models/User');

async function deleteMyAccount(req, res) {
  await User.findByIdAndDelete(req.user._id);
  return res.status(204).send();
}

module.exports = { deleteMyAccount };
